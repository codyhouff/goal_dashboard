param(
    [string]$ConfigPath,
    [string]$ActivityPath,
    [string]$BalancePath,
    [string]$PositionsPath,
    [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot

if (-not $ConfigPath) {
    $ConfigPath = Join-Path $repoRoot 'private/config/financial-independence.json'
}
if (-not $OutputDirectory) {
    $OutputDirectory = Join-Path $repoRoot 'private/imports/fidelity/processed/net-worth'
}

function Resolve-SingleCsv([string]$Path, [string]$DefaultDirectory, [string]$Label) {
    if ($Path) {
        return (Resolve-Path -LiteralPath $Path).Path
    }

    $files = @(Get-ChildItem -LiteralPath $DefaultDirectory -Filter '*.csv' -File)
    if ($files.Count -ne 1) {
        throw "Expected exactly one $Label CSV in $DefaultDirectory; found $($files.Count)."
    }
    return $files[0].FullName
}

function ConvertTo-Decimal($Value) {
    if ($null -eq $Value) { return [decimal]0 }
    $source = [string]$Value
    $clean = $source -replace '[\$,()%]', ''
    if ($source -match '^\(.*\)$') { $clean = '-' + $clean }
    $parsed = [decimal]0
    if (-not [decimal]::TryParse(
        $clean,
        [Globalization.NumberStyles]::Any,
        [Globalization.CultureInfo]::InvariantCulture,
        [ref]$parsed
    )) {
        throw "Could not parse a numeric CSV value."
    }
    return $parsed
}

function ConvertTo-IsoDate([datetime]$Date) {
    return $Date.ToString('yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)
}

$activityPath = Resolve-SingleCsv $ActivityPath (Join-Path $repoRoot 'private/imports/fidelity/processed/activity') 'activity'
$balancePath = Resolve-SingleCsv $BalancePath (Join-Path $repoRoot 'private/imports/fidelity/processed/balance-history') 'balance-history'
$positionsPath = Resolve-SingleCsv $PositionsPath (Join-Path $repoRoot 'private/imports/fidelity/processed/positions') 'positions'

$config = Get-Content -LiteralPath $ConfigPath -Raw | ConvertFrom-Json
$historyStart = [datetime]::ParseExact($config.history_start, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)
$performanceStart = [datetime]::ParseExact($config.performance_start, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)
$forecastStart = [datetime]::ParseExact($config.forecast_contribution_start, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)
$birthDate = [datetime]::ParseExact($config.birth_date, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)
$positionsDate = [datetime]::ParseExact($config.positions_snapshot_date, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)

$activity = @(Import-Csv -LiteralPath $activityPath | Where-Object { $_.'Run Date' } | ForEach-Object -Begin { $index = 0 } -Process {
    $text = (($_.Action + ' ' + $_.Description + ' ' + $_.Type).Trim()).ToUpperInvariant()
    [pscustomobject]@{
        Index = $index++
        Date = [datetime]::Parse($_.'Run Date', [Globalization.CultureInfo]::InvariantCulture)
        Account = [string]$_.'Account Number'
        Amount = ConvertTo-Decimal $_.Amount
        Text = $text
        Classification = $null
        Reason = $null
    }
})

foreach ($row in $activity) {
    if ($row.Date -le $historyStart) {
        $row.Classification = 'opening-period'
        $row.Reason = 'Included in opening principal'
    } elseif ($row.Text -match 'TRANSFER|JOURNAL') {
        $row.Classification = 'transfer-review'
    } elseif ($row.Text -match 'YOU BOUGHT|YOU SOLD|REINVESTMENT|DIVIDEND|INTEREST|REALIZED GAIN|EXCHANGES|FOREIGN TAX|FEE|^DISTRIBUTION ') {
        $row.Classification = 'market'
        $row.Reason = 'Trade, investment income, tax, fee, or market distribution'
    } elseif ($row.Text -match 'DIRECT DEPOSIT|CHECK RECEIVED|CONTRIBUTION|CREDIT ADJ|DEBIT CARD RETURN|CASH BACK|REFUND') {
        $row.Classification = 'external-flow'
        $row.Reason = 'External inflow'
    } elseif ($row.Text -match 'DIRECT DEBIT|DEBIT CARD PURCHASE|CASH ADVANCE|ATM|WITHDRAWAL|PURCHASE POS') {
        $row.Classification = 'external-flow'
        $row.Reason = 'External outflow'
    } else {
        $row.Classification = 'review'
        $row.Reason = 'No classification rule matched'
    }
}

$transferRows = @($activity | Where-Object { $_.Classification -eq 'transfer-review' })
$pairedIndexes = [Collections.Generic.HashSet[int]]::new()

for ($leftIndex = 0; $leftIndex -lt $transferRows.Count; $leftIndex += 1) {
    $left = $transferRows[$leftIndex]
    if ($pairedIndexes.Contains($left.Index)) { continue }

    for ($rightIndex = 0; $rightIndex -lt $transferRows.Count; $rightIndex += 1) {
        $right = $transferRows[$rightIndex]
        if ($left.Index -eq $right.Index -or $pairedIndexes.Contains($right.Index)) { continue }
        if ($left.Account -eq $right.Account) { continue }
        if ([math]::Abs(($left.Date - $right.Date).TotalDays) -gt 3) { continue }
        if ([math]::Abs([double]($left.Amount + $right.Amount)) -ge 0.01) { continue }

        [void]$pairedIndexes.Add($left.Index)
        [void]$pairedIndexes.Add($right.Index)
        $left.Classification = 'internal-transfer'
        $right.Classification = 'internal-transfer'
        $left.Reason = 'Paired transfer between tracked accounts'
        $right.Reason = 'Paired transfer between tracked accounts'
        break
    }
}

$contributionReceipts = @($activity | Where-Object {
    $_.Classification -eq 'external-flow' -and
    $_.Amount -gt 0 -and
    $_.Text -match 'CASH CONTRIBUTION|CURRENT YEAR CONTRIBUTION'
})

foreach ($transfer in @($activity | Where-Object { $_.Classification -eq 'transfer-review' -and $_.Amount -lt 0 -and $_.Text -match 'CONTRIBUT' })) {
    $receipt = $contributionReceipts | Where-Object {
        $_.Classification -eq 'external-flow' -and
        $_.Account -ne $transfer.Account -and
        [math]::Abs(($_.Date - $transfer.Date).TotalDays) -le 1 -and
        [math]::Abs([double]($_.Amount + $transfer.Amount)) -lt 0.01
    } | Select-Object -First 1

    if ($receipt) {
        $transfer.Classification = 'internal-transfer'
        $receipt.Classification = 'internal-transfer'
        $transfer.Reason = 'Paired contribution transfer between tracked accounts'
        $receipt.Reason = 'Paired contribution transfer between tracked accounts'
    }
}

foreach ($row in @($activity | Where-Object { $_.Classification -eq 'transfer-review' })) {
    if ($row.Text -match 'BROKERAGE OPTION|BROKERAGE.?LINK') {
        $row.Classification = 'internal-transfer'
        $row.Reason = 'Internal workplace-plan/BrokerageLink movement'
    } elseif ($row.Text -match 'TRANSFER OF ASSETS CHECK RECEIVED|OPTUM|EXTERNAL') {
        $row.Classification = 'external-flow'
        $row.Reason = 'Transfer from outside the tracked Fidelity portfolio'
    } else {
        $row.Classification = 'review'
        $row.Reason = 'Unpaired transfer requires review'
    }
}

$reviewRows = @($activity | Where-Object { $_.Classification -eq 'review' })
if ($reviewRows.Count -gt 0) {
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
    $reviewPath = Join-Path $OutputDirectory 'transaction-review.csv'
    $reviewRows | Select-Object @{n='date';e={ConvertTo-IsoDate $_.Date}}, @{n='direction';e={if ($_.Amount -ge 0) {'in'} else {'out'}}}, Reason | Export-Csv -LiteralPath $reviewPath -NoTypeInformation
    throw "$($reviewRows.Count) transaction(s) require review. See $reviewPath."
}

$balances = @(Import-Csv -LiteralPath $balancePath | ForEach-Object {
    [pscustomobject]@{
        Date = [datetime]::ParseExact($_.date, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)
        Balance = ConvertTo-Decimal $_.total_balance
        Source = 'balance-history'
    }
} | Where-Object { $_.Date -ge $historyStart } | Sort-Object Date)

$opening = $balances | Where-Object { $_.Date -eq $historyStart } | Select-Object -First 1
if (-not $opening) { throw "No balance exists on the configured history start date." }

$positions = @(Import-Csv -LiteralPath $positionsPath | Where-Object { $_.'Account number' -and $_.'Current value' } | ForEach-Object -Begin { $positionIndex = 0 } -Process {
    [pscustomobject]@{
        Index = $positionIndex++
        Account = [string]$_.'Account number'
        AccountName = [string]$_.'Account name'
        Symbol = [string]$_.Symbol
        Description = [string]$_.Description
        Value = ConvertTo-Decimal $_.'Current value'
    }
} | Where-Object { $_.Value -ne 0 })

$brokerageLinkAccounts = @($positions | Where-Object { $_.AccountName -match 'BROKERAGE.?LINK' } | Select-Object -ExpandProperty Account -Unique)
$brokerageLinkTotal = ($positions | Where-Object { $brokerageLinkAccounts -contains $_.Account } | Measure-Object Value -Sum).Sum
$duplicateSummaryRows = @($positions | Where-Object {
    $brokerageLinkAccounts -notcontains $_.Account -and
    (($_.Symbol + ' ' + $_.Description) -match 'BROKERAGE.?LINK') -and
    $brokerageLinkTotal -ne 0 -and
    ([math]::Abs([double]($_.Value - $brokerageLinkTotal)) / [math]::Abs([double]$brokerageLinkTotal)) -lt 0.005
})

if ($brokerageLinkAccounts.Count -gt 0 -and $duplicateSummaryRows.Count -ne 1) {
    throw "Expected one parent-plan BrokerageLink summary row; found $($duplicateSummaryRows.Count)."
}

$duplicateIndexes = [Collections.Generic.HashSet[int]]::new()
foreach ($duplicate in $duplicateSummaryRows) { [void]$duplicateIndexes.Add($duplicate.Index) }
$positionsTotal = ($positions | Where-Object { -not $duplicateIndexes.Contains($_.Index) } | Measure-Object Value -Sum).Sum

if ($positionsDate -gt $balances[-1].Date) {
    $balances += [pscustomobject]@{ Date = $positionsDate; Balance = [decimal]$positionsTotal; Source = 'positions-snapshot' }
    $balances = @($balances | Sort-Object Date)
}

$externalFlows = @($activity | Where-Object { $_.Classification -eq 'external-flow' -and $_.Date -gt $historyStart })
$dailyFlows = @{}
$unmappedFlows = 0
foreach ($flow in $externalFlows) {
    $mappedDate = $balances | Where-Object { $_.Date -ge $flow.Date } | Select-Object -First 1 -ExpandProperty Date
    if (-not $mappedDate) {
        $unmappedFlows += 1
        continue
    }
    $key = ConvertTo-IsoDate $mappedDate
    if (-not $dailyFlows.ContainsKey($key)) { $dailyFlows[$key] = [decimal]0 }
    $dailyFlows[$key] += $flow.Amount
}
if ($unmappedFlows -gt 0) { throw "$unmappedFlows external flow(s) occur after the final balance date." }

$openingPrincipal = [decimal]$opening.Balance
$cumulativeContributions = [decimal]0
$previousBalance = $null
$rows = @()

foreach ($balance in $balances) {
    $key = ConvertTo-IsoDate $balance.Date
    $dailyContribution = if ($balance.Date -eq $historyStart) { [decimal]0 } elseif ($dailyFlows.ContainsKey($key)) { [decimal]$dailyFlows[$key] } else { [decimal]0 }
    $cumulativeContributions += $dailyContribution
    $contributedCapital = $openingPrincipal + $cumulativeContributions
    $investmentGrowth = [decimal]$balance.Balance - $contributedCapital
    $dailyGrowth = if ($null -eq $previousBalance) { [decimal]0 } else { [decimal]$balance.Balance - [decimal]$previousBalance - $dailyContribution }
    $age = ($balance.Date - $birthDate).TotalDays / 365.2425

    $rows += [pscustomobject]@{
        date = $key
        age = [math]::Round($age, 6)
        net_worth = [math]::Round([decimal]$balance.Balance, 2)
        opening_principal = [math]::Round($openingPrincipal, 2)
        daily_net_contribution = [math]::Round($dailyContribution, 2)
        cumulative_net_contributions = [math]::Round($cumulativeContributions, 2)
        contributed_capital = [math]::Round($contributedCapital, 2)
        daily_investment_growth = [math]::Round($dailyGrowth, 2)
        investment_growth = [math]::Round($investmentGrowth, 2)
        source = $balance.Source
    }
    $previousBalance = $balance.Balance
}

$identityFailures = @($rows | Where-Object { [math]::Abs([double]($_.net_worth - $_.contributed_capital - $_.investment_growth)) -ge 0.011 })
if ($identityFailures.Count -gt 0) { throw "$($identityFailures.Count) output row(s) failed the component identity." }

$forecastRows = @($rows | Where-Object { [datetime]$_.date -ge $forecastStart })
if ($forecastRows.Count -lt 2) { throw "Not enough rows exist after the forecast contribution start date." }
$forecastDays = ([datetime]$forecastRows[-1].date - [datetime]$forecastRows[0].date).TotalDays
$forecastNetContributions = ($forecastRows | Measure-Object daily_net_contribution -Sum).Sum
$monthlyContributionPace = if ($forecastDays -gt 0) { [decimal]$forecastNetContributions / [decimal]$forecastDays * [decimal](365.2425 / 12) } else { [decimal]0 }

$returnFactor = 1.0
for ($index = 1; $index -lt $forecastRows.Count; $index += 1) {
    $prior = [double]$forecastRows[$index - 1].net_worth
    $current = [double]$forecastRows[$index].net_worth
    $flow = [double]$forecastRows[$index].daily_net_contribution
    if ($prior -le 0) { throw "Cannot calculate a daily return from a non-positive prior balance." }
    $factor = ($current - $flow) / $prior
    if ($factor -le 0) { throw "A cash-flow-adjusted daily return factor was non-positive." }
    $returnFactor *= $factor
}
$annualizedReturn = if ($forecastDays -gt 0) { [math]::Pow($returnFactor, 365.2425 / $forecastDays) - 1 } else { 0 }

New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$outputPath = Join-Path $OutputDirectory 'net-worth-components.csv'
$metadataPath = Join-Path $OutputDirectory 'net-worth-metadata.json'
$rows | Export-Csv -LiteralPath $outputPath -NoTypeInformation

[ordered]@{
    generated_at = [datetime]::UtcNow.ToString('o')
    history_start = ConvertTo-IsoDate $historyStart
    performance_start = ConvertTo-IsoDate $performanceStart
    forecast_contribution_start = ConvertTo-IsoDate $forecastStart
    latest_date = $rows[-1].date
    row_count = $rows.Count
    monthly_net_contribution_pace = [math]::Round($monthlyContributionPace, 2)
    annualized_cash_flow_adjusted_return = [math]::Round($annualizedReturn, 8)
    duplicate_brokeragelink_summary_rows_removed = $duplicateSummaryRows.Count
    transaction_counts = [ordered]@{
        external_flows = $externalFlows.Count
        internal_transfers = @($activity | Where-Object { $_.Classification -eq 'internal-transfer' }).Count
        market_activity = @($activity | Where-Object { $_.Classification -eq 'market' }).Count
        review = 0
    }
} | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $metadataPath -Encoding utf8

Write-Output "Generated $($rows.Count) reconciled daily rows from $(ConvertTo-IsoDate $historyStart) through $($rows[-1].date)."
Write-Output "Removed $($duplicateSummaryRows.Count) duplicate BrokerageLink summary row(s); unresolved transactions: 0."

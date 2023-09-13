import { FC } from 'react'
import WarningMessage from './WarningMessage'
import ErrorMessage from './ErrorMessage'
import Utils from 'common/utils/utils'
import { useGetSubscriptionMetadataQuery } from 'common/services/useSubscriptionMetadata'
import Format from 'common/utils/format'
import { useGetOrganisationUsageQuery } from 'common/services/useOrganisationUsage'

type EnvironmentLimitType = {
  id: string
  environmentId: string
  projectId: string
}

const OrganisationLimit: FC<EnvironmentLimitType> = ({ id }) => {
  const {} = useGetOrganisationUsageQuery({ organisationId: id })
  const { data: maxApiCalls } = useGetSubscriptionMetadataQuery({ id })
  const maxApiCallsPercentage = Utils.calculateRemainingLimitsPercentage(
    this.state.totalApiCalls,
    maxApiCalls,
    70,
  ).percentage

  const alertMaxApiCallsText = `You have used ${Format.shortenNumber(
    this.state.totalApiCalls,
  )}/${Format.shortenNumber(maxApiCalls)} of your allowed requests.`

  return (
    <Row>
      {Utils.getFlagsmithHasFeature('payments_enabled') &&
        Utils.getFlagsmithHasFeature('max_api_calls_alert') &&
        (maxApiCallsPercentage && maxApiCallsPercentage < 100 ? (
          <WarningMessage
            warningMessage={alertMaxApiCallsText}
            warningMessageClass={'announcement'}
            enabledButton
          />
        ) : (
          maxApiCallsPercentage >= 100 && (
            <ErrorMessage
              error={alertMaxApiCallsText}
              errorMessageClass={'announcement'}
              enabledButton
            />
          )
        ))}
    </Row>
  )
}

export default OrganisationLimit

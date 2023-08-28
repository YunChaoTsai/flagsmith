import {
  FeatureState,
  FeatureVersion,
  FeatureVersionState,
  Res,
} from 'common/types/responses'
import { Req } from 'common/types/requests'
import { service } from 'common/service'
import { awaitExpression } from '@babel/types'
import { getStore } from 'common/store'
import {
  createVersionFeatureState,
  deleteVersionFeatureState,
  getVersionFeatureState,
  updateVersionFeatureState,
} from './useVersionFeatureState'
import { deleteFeatureSegment } from './useFeatureSegment'
import transformCorePaging from 'common/transformCorePaging'

export const featureVersionService = service
  .enhanceEndpoints({ addTagTypes: ['FeatureVersion'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      createAndPublishFeatureVersion: builder.mutation<
        Res['featureVersion'],
        Req['createAndPublishFeatureVersion']
      >({
        invalidatesTags: [{ id: 'LIST', type: 'FeatureVersion' }],
        queryFn: async (query: Req['createAndPublishFeatureVersion']) => {
          // Create a version, update the feature state, publish the changes
          const versionRes: { data: FeatureVersion } =
            await createFeatureVersion(getStore(), {
              environmentId: query.environmentId,
              featureId: query.featureId,
            })
          const currentFeatureStates: { data: FeatureState[] } =
            await getVersionFeatureState(getStore(), {
              environmentId: query.environmentId,
              featureId: query.featureId,
              sha: versionRes.data.uuid,
            })
          const res = await Promise.all(
            query.featureStates.map((featureState) => {
              const matchingVersionState = currentFeatureStates.data.find(
                (feature) => {
                  return (
                    feature.feature_segment?.segment ===
                    featureState.feature_segment?.segment
                  )
                },
              )
              if (matchingVersionState) {
                if (featureState.toRemove) {
                  if (featureState.feature_segment) {
                    return deleteFeatureSegment(getStore(), {
                      id: featureState.feature_segment.id,
                    })
                  }
                }
                return updateVersionFeatureState(getStore(), {
                  environmentId: query.environmentId,
                  featureId: query.featureId,
                  featureState,
                  id: matchingVersionState.id,
                  sha: versionRes.data.uuid,
                })
              } else {
                return createVersionFeatureState(getStore(), {
                  environmentId: query.environmentId,
                  featureId: query.featureId,
                  featureState,
                  sha: versionRes.data.uuid,
                })
              }
            }),
          )
          const ret = { data: res, error: res.find((v) => !!v.error)?.error }
          await publishFeatureVersion(getStore(), {
            environmentId: query.environmentId,
            featureId: query.featureId,
            sha: versionRes.data.uuid,
          })

          return ret as any
        },
      }),
      createFeatureVersion: builder.mutation<
        Res['featureVersion'],
        Req['createFeatureVersion']
      >({
        invalidatesTags: [{ id: 'LIST', type: 'FeatureVersion' }],
        query: (query: Req['createFeatureVersion']) => ({
          body: query,
          method: 'POST',
          url: `environments/${query.environmentId}/features/${query.featureId}/versions/`,
        }),
      }),
      getFeatureVersions: builder.query<
        Res['featureVersions'],
        Req['getFeatureVersions']
      >({
        providesTags: [{ id: 'LIST', type: 'FeatureVersion' }],
        query: (query) => ({
          url: `environments/${query.environmentId}/features/${query.featureId}/versions/`,
        }),
        transformResponse: (
          baseQueryReturnValue: Res['featureVersions'],
          meta,
          req,
        ) => {
          return transformCorePaging(req, baseQueryReturnValue)
        },
      }),
      publishFeatureVersion: builder.mutation<
        Res['featureVersion'],
        Req['publishFeatureVersion']
      >({
        invalidatesTags: [{ id: 'LIST', type: 'FeatureVersion' }],
        query: (query: Req['publishFeatureVersion']) => ({
          body: query,
          method: 'POST',
          url: `environments/${query.environmentId}/features/${query.featureId}/versions/${query.sha}/publish/`,
        }),
      }),
      // END OF ENDPOINTS
    }),
  })

export async function createFeatureVersion(
  store: any,
  data: Req['createFeatureVersion'],
  options?: Parameters<
    typeof featureVersionService.endpoints.createFeatureVersion.initiate
  >[1],
) {
  return store.dispatch(
    featureVersionService.endpoints.createFeatureVersion.initiate(
      data,
      options,
    ),
  )
}
export async function publishFeatureVersion(
  store: any,
  data: Req['publishFeatureVersion'],
  options?: Parameters<
    typeof featureVersionService.endpoints.publishFeatureVersion.initiate
  >[1],
) {
  return store.dispatch(
    featureVersionService.endpoints.publishFeatureVersion.initiate(
      data,
      options,
    ),
  )
}
export async function createAndPublishFeatureVersion(
  store: any,
  data: Req['createAndPublishFeatureVersion'],
  options?: Parameters<
    typeof featureVersionService.endpoints.createAndPublishFeatureVersion.initiate
  >[1],
) {
  return store.dispatch(
    featureVersionService.endpoints.createAndPublishFeatureVersion.initiate(
      data,
      options,
    ),
  )
}
export async function getFeatureVersions(
  store: any,
  data: Req['getFeatureVersions'],
  options?: Parameters<
    typeof featureVersionService.endpoints.getFeatureVersions.initiate
  >[1],
) {
  return store.dispatch(
    featureVersionService.endpoints.getFeatureVersions.initiate(data, options),
  )
}
// END OF FUNCTION_EXPORTS

export const {
  useCreateAndPublishFeatureVersionMutation,
  useCreateFeatureVersionMutation,
  useGetFeatureVersionsQuery,
  // END OF EXPORTS
} = featureVersionService

/* Usage examples:
const { data, isLoading } = useGetFeatureVersionQuery({ id: 2 }, {}) //get hook
const [createFeatureVersion, { isLoading, data, isSuccess }] = useCreateFeatureVersionMutation() //create hook
featureVersionService.endpoints.getFeatureVersion.select({id: 2})(store.getState()) //access data from any function
*/
import { embeddedScripts } from "@wix/app-management";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type WixError = {
  message: string;
  details: {
    applicationError: {
      description: string;
      code: string;
      data: Record<string, unknown>;
    };
  };
};

export const QUERY_EMBEDS = "queryEmbeds";
export const MUTATE_EMBEDS = "mutateEmbeds";

export const useEmbeds = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Record<string, unknown>, WixError>({
    queryKey: [QUERY_EMBEDS],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      // https://dev.wix.com/docs/sdk/backend-modules/app-management/embedded-scripts/get-embedded-script
      const embeddedScript = await embeddedScripts.getEmbeddedScript();
      return (embeddedScript.parameters as Record<string, unknown>) || {};
    },
    retry(_, error) {
      return !(
        (error as WixError)?.details?.applicationError?.code ===
        "NO_HTML_EMBEDS_ON_SITE"
      );
    },
  });

  const mutation = useMutation<
    Record<string, unknown>,
    WixError,
    Record<string, unknown>
  >({
    mutationKey: [MUTATE_EMBEDS],
    mutationFn: async (parameters) => {
      // https://dev.wix.com/docs/sdk/backend-modules/app-management/embedded-scripts/embed-script
      await embeddedScripts.embedScript({
        // embedScript typing expects Record<string, string>; allow object payloads via cast
        parameters: parameters as Record<string, string>,
      });
      return parameters;
    },
    onSuccess: (data) => {
      console.log("data", data);
      queryClient.setQueryData([QUERY_EMBEDS], data);
    },
  });

  const loadParams = async () => {
    // Ensure we have the freshest data
    const res = await query.refetch();
    return res.data || {};
  };

  const saveParams = async (parameters: Record<string, unknown>) => {
    return mutation.mutateAsync(parameters);
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    loadParams,
    saveParams,
  };
};

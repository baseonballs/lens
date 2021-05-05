import { KubeObjectStore } from "../../kube-object.store";
import { ResourceQuota, resourceQuotaApi } from "../../api/endpoints/resource-quota.api";
import { apiManager } from "../../api/api-manager";

export class ResourceQuotasStore extends KubeObjectStore<ResourceQuota> {
  api = resourceQuotaApi;
}

export const resourceQuotaStore = new ResourceQuotasStore();
apiManager.registerStore(resourceQuotaStore);

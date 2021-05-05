import { makeObservable, observable } from "mobx";
import { KubeObjectStore } from "../../kube-object.store";
import { IPodMetrics, podsApi, PodStatus, StatefulSet, statefulSetApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { apiManager } from "../../api/api-manager";

export class StatefulSetStore extends KubeObjectStore<StatefulSet> {
  api = statefulSetApi;
  @observable metrics: IPodMetrics = null;

  constructor() {
    super();

    makeObservable(this);
  }

  async loadMetrics(statefulSet: StatefulSet) {
    const pods = this.getChildPods(statefulSet);

    this.metrics = await podsApi.getMetrics(pods, statefulSet.getNs(), "");
  }

  getChildPods(statefulSet: StatefulSet) {
    return podsStore.getPodsByOwnerId(statefulSet.getId());
  }

  getStatuses(statefulSets: StatefulSet[]) {
    const status = { failed: 0, pending: 0, running: 0 };

    statefulSets.forEach(statefulSet => {
      const pods = this.getChildPods(statefulSet);

      if (pods.some(pod => pod.getStatus() === PodStatus.FAILED)) {
        status.failed++;
      } else if (pods.some(pod => pod.getStatus() === PodStatus.PENDING)) {
        status.pending++;
      } else {
        status.running++;
      }
    });

    return status;
  }

  reset() {
    this.metrics = null;
  }
}

export const statefulSetStore = new StatefulSetStore();
apiManager.registerStore(statefulSetStore);

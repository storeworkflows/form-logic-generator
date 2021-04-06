export default class PlatformResource {
    private static assignPlatformResources;
    loadPlatformResources(): Promise<unknown>;
    load(id: any): Promise<void>;
}

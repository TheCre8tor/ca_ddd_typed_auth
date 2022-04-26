export abstract class WatchedList<T> {
    private initial: T[];
    private new: T[];
    public currentItems: T[];
    private removed: T[];

    constructor(initialItems?: T[]) {
        this.initial = initialItems ? initialItems : [];
        this.new = [];
        this.currentItems = initialItems ? initialItems : [];
        this.removed = [];
    }

    public abstract compareItems(a: T, b: T): boolean;

    public getItems(): T[] {
        return this.currentItems;
    }

    public getNewItems(): T[] {
        return this.new;
    }

    public getRemovedItems(): T[] {
        return this.removed;
    }

    private isNewItem(item: T): boolean {
        const items = this.new.filter((value: T) => this.compareItems(item, value));
        return items.length !== 0;
    }

    private isCurrentItem(item: T): boolean {
        const items = this.currentItems.filter((value: T) => this.compareItems(item, value));
        return items.length !== 0;
    }

    private isRemovedItem(item: T): boolean {
        const items = this.removed.filter((value: T) => this.compareItems(item, value));
        return items.length !== 0;
    }

    private removeFromNew(item: T): void {
        this.new = this.new.filter((value: T) => !this.compareItems(item, value));
    }

    private removeFromCurrent(item: T): void {
        this.currentItems = this.currentItems.filter((value: T) => !this.compareItems(item, value));
    }

    private removeFromRemoved(item: T): void {
        this.removed = this.removed.filter((value: T) => !this.compareItems(item, value));
    }

    private wasAddedInitially(item: T): boolean {
        const items = this.initial.filter((value: T) => this.compareItems(item, value));
        return items.length !== 0;
    }

    public exists(item: T): boolean {
        return this.isCurrentItem(item);
    }

    // todo: study this code!
    public add(item: T): void {
        if (this.isRemovedItem(item)) {
            this.removeFromRemoved(item);
        }

        if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
            this.new.push(item);
        }

        if (!this.isCurrentItem(item)) {
            this.currentItems.push(item);
        }
    }

    public remove(item: T): void {
        this.removeFromCurrent(item);

        if (this.isNewItem(item)) {
            this.removeFromNew(item);
            return;
        }

        if (!this.isRemovedItem(item)) {
            this.removed.push(item);
        }
    }
}

import type { Entity } from "../bot/common/Entity";

export interface Repository<TEntity extends Entity> {
    getById(id: number): Promise<TEntity>;
    create(entity: Omit<TEntity, 'id'>): Promise<TEntity>;
}
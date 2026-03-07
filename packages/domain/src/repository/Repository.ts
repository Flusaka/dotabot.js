import type { Entity } from "../common/Entity";

export interface Repository<TEntity extends Entity> {
  getById(id: number): Promise<TEntity>;
  create(entity: Omit<TEntity, "id">): Promise<TEntity>;
  update(id: number, entity: Partial<TEntity>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

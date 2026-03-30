import z from "zod";
import {
  DeletionIncident,
  Incident,
  NonDeletionIncident,
} from "../models/incident/Incident";
import { Response } from "../request/Request";
import { RequestBuilder } from "../request/RequestBuilder";
import { IncidentType } from "../models/incident/IncidentType";

interface GetIncidentsRequestParams {
  // TODO: filter
  // TODO: range
  // TODO: sort
  // TODO: page
  type?: IncidentType[];
  since?: Date;
  // TODO: videogame ID or slug
}

export class IncidentsClient {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getAdditions(): Promise<Response<NonDeletionIncident[]>> {
    const request = new RequestBuilder<NonDeletionIncident[]>()
      .setPath("/additions")
      .setResponseSchema(z.array(NonDeletionIncident))
      .setToken(this.token)
      .build();

    return request.execute();
  }

  async getChanges(): Promise<Response<NonDeletionIncident[]>> {
    const request = new RequestBuilder<NonDeletionIncident[]>()
      .setPath("/changes")
      .setResponseSchema(z.array(NonDeletionIncident))
      .setToken(this.token)
      .build();

    return request.execute();
  }

  async getDeletions(): Promise<Response<DeletionIncident[]>> {
    const request = new RequestBuilder<DeletionIncident[]>()
      .setPath("/deletions")
      .setResponseSchema(z.array(DeletionIncident))
      .setToken(this.token)
      .build();

    return request.execute();
  }

  async getAll(
    requestParams?: GetIncidentsRequestParams,
  ): Promise<Response<Incident[]>> {
    const request = new RequestBuilder<Incident[]>()
      .setPath("/incidents")
      .setResponseSchema(z.array(Incident))
      .setToken(this.token)
      .addQueryParam({
        key: "since",
        value: requestParams?.since,
      })
      .addQueryParam({
        key: "type",
        value: requestParams?.type,
      })
      .build();

    return request.execute();
  }
}

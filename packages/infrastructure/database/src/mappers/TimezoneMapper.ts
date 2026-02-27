import { Timezone } from "@dotabot.js/domain/Timezone";
import { Timezone as TimezoneModel } from "../generated/prisma/client";

export class TimezoneMapper {
  static toDomain(model: TimezoneModel): Timezone {
    switch (model) {
      case TimezoneModel.EET:
        return Timezone.EET;
      case TimezoneModel.GMT:
      default:
        return Timezone.GMT;
    }
  }

  static toModel(domain: Timezone): TimezoneModel {
    switch (domain) {
      case Timezone.EET:
        return TimezoneModel.EET;
      case Timezone.GMT:
      default:
        return TimezoneModel.GMT;
    }
  }
}

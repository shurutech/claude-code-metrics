import type { PivotResult } from "./pivot";

export type KpiData = { total: number };

export type DailyTotalRow = { day: string; total: number };

export type LocVsDevsRow = { day: string; totalLoc: number; activeDevs: number };

export type PerDevData = PivotResult;

export type TokenKpiData = { total: number };

export type TokenDailyRow = { day: string; total: number };

export type TokenPerDevData = PivotResult;

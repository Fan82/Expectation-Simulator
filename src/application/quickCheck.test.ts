import { describe, it, expect } from "vitest";
import { runQuickCheck } from "./quickCheck";

const issueFields = (planned: number, available: number) => {
    const outcome = runQuickCheck(planned, available);
    return outcome.status === "invalid" ? outcome.issues.map((i) => i.field) : [];
};

describe("runQuickCheck", () => {
    it("60 / 30 → ok, gap 30", () => {
        const outcome = runQuickCheck(60, 30);
        expect(outcome.status).toBe("ok");
        if (outcome.status === "ok") {
            expect(outcome.result.schedulableMinutes).toBe(30);
            expect(outcome.result.gapMinutes).toBe(30);
        }
    });

    it("empty field → empty, not an error", () => {
        expect(runQuickCheck(Number.NaN, 30).status).toBe("empty");
    });

    it("negative available → issue on available", () => {
        expect(issueFields(60, -10)).toEqual(["available"]);
    });

    it("over daily limit → issue on available", () => {
        expect(issueFields(60, 1441)).toEqual(["available"]);
    });

    it("decimal planned → issue on planned", () => {
        expect(issueFields(3.5, 30)).toEqual(["planned"]);
    });

    it("both fields invalid → two issues", () => {
        expect(issueFields(-5, 2000)).toEqual(["planned", "available"]);
    });

    it("0 / 0 is valid", () => {
        const outcome = runQuickCheck(0, 0);
        expect(outcome.status).toBe("ok");
        if (outcome.status === "ok") {
            expect(outcome.result.gapMinutes).toBe(0);
        }
    });
});
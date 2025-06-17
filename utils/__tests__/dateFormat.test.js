import { formatTimeAgo } from "../dateFormat";

// Mock date-fns functions
jest.mock("date-fns", () => ({
    formatDistanceToNowStrict: jest.fn(),
}));

jest.mock("date-fns/locale/pt-BR", () => ({
    ptBR: "mocked-ptBR-locale",
}));

import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

const mockFormatDistanceToNowStrict = formatDistanceToNowStrict

describe("dateFormat", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("formatTimeAgo", () => {
        it("should format time ago with string date input", () => {
            const testDate = "2024-01-01T12:00:00Z";
            mockFormatDistanceToNowStrict.mockReturnValue("há 2 horas");

            const result = formatTimeAgo(testDate);

            expect(mockFormatDistanceToNowStrict).toHaveBeenCalledWith(
                new Date(testDate),
                {
                    addSuffix: true,
                    locale: ptBR,
                }
            );
            expect(result).toBe("Há 2 horas");
        });

        it("should format time ago with Date object input", () => {
            const testDate = new Date("2024-01-01T12:00:00Z");
            mockFormatDistanceToNowStrict.mockReturnValue("há 1 dia");

            const result = formatTimeAgo(testDate);

            expect(mockFormatDistanceToNowStrict).toHaveBeenCalledWith(
                testDate,
                {
                    addSuffix: true,
                    locale: ptBR,
                }
            );
            expect(result).toBe("Há 1 dia");
        });

        it("should replace 'há' with 'Há' (capitalize)", () => {
            const testDate = "2024-01-01T12:00:00Z";
            mockFormatDistanceToNowStrict.mockReturnValue("há 5 minutos");

            const result = formatTimeAgo(testDate);

            expect(result).toBe("Há 5 minutos");
        });

        it("should handle multiple occurrences of 'há' in the string", () => {
            const testDate = "2024-01-01T12:00:00Z";
            mockFormatDistanceToNowStrict.mockReturnValue("há cerca de há muito tempo");

            const result = formatTimeAgo(testDate);

            // Should only replace the first occurrence
            expect(result).toBe("Há cerca de há muito tempo");
        });

        it("should not modify string if 'há' is not present", () => {
            const testDate = "2024-01-01T12:00:00Z";
            mockFormatDistanceToNowStrict.mockReturnValue("2 horas atrás");

            const result = formatTimeAgo(testDate);

            expect(result).toBe("2 horas atrás");
        });

        it("should handle different time periods", () => {
            const testDate = "2024-01-01T12:00:00Z";

            // Test seconds
            mockFormatDistanceToNowStrict.mockReturnValue("há 30 segundos");
            expect(formatTimeAgo(testDate)).toBe("Há 30 segundos");

            // Test minutes
            mockFormatDistanceToNowStrict.mockReturnValue("há 15 minutos");
            expect(formatTimeAgo(testDate)).toBe("Há 15 minutos");

            // Test hours
            mockFormatDistanceToNowStrict.mockReturnValue("há 3 horas");
            expect(formatTimeAgo(testDate)).toBe("Há 3 horas");

            // Test days
            mockFormatDistanceToNowStrict.mockReturnValue("há 2 dias");
            expect(formatTimeAgo(testDate)).toBe("Há 2 dias");

            // Test weeks
            mockFormatDistanceToNowStrict.mockReturnValue("há 1 semana");
            expect(formatTimeAgo(testDate)).toBe("Há 1 semana");

            // Test months
            mockFormatDistanceToNowStrict.mockReturnValue("há 1 mês");
            expect(formatTimeAgo(testDate)).toBe("Há 1 mês");

            // Test years
            mockFormatDistanceToNowStrict.mockReturnValue("há 1 ano");
            expect(formatTimeAgo(testDate)).toBe("Há 1 ano");
        });

        it("should handle invalid date strings", () => {
            const testDate = "invalid-date";
            mockFormatDistanceToNowStrict.mockReturnValue("há data inválida");

            const result = formatTimeAgo(testDate);

            expect(mockFormatDistanceToNowStrict).toHaveBeenCalledWith(
                expect.any(Date), {
                "addSuffix": true, "locale": "mocked-ptBR-locale"
            }// This will create an Invalid Date
            );
            expect(result).toBe("Há data inválida");
        });

        it("should use Portuguese Brazilian locale", () => {
            const testDate = "2024-01-01T12:00:00Z";
            mockFormatDistanceToNowStrict.mockReturnValue("há 1 hora");

            formatTimeAgo(testDate);

            expect(mockFormatDistanceToNowStrict).toHaveBeenCalledWith(
                expect.any(Date),
                expect.objectContaining({
                    locale: ptBR,
                })
            );
        });

        it("should use addSuffix option", () => {
            const testDate = "2024-01-01T12:00:00Z";
            mockFormatDistanceToNowStrict.mockReturnValue("há 1 hora");

            formatTimeAgo(testDate);

            expect(mockFormatDistanceToNowStrict).toHaveBeenCalledWith(
                expect.any(Date),
                expect.objectContaining({
                    addSuffix: true,
                })
            );
        });
    });
});
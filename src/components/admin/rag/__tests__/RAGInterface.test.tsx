import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RAGInterface from "../RAGInterface";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Mock MagneticButton
jest.mock("../../../ui/MagneticButton", () => ({
	MagneticButton: ({
		children,
		onClick,
		type,
		disabled,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		type?: "button" | "submit" | "reset";
		disabled?: boolean;
	}) => (
		<button onClick={onClick} type={type} disabled={disabled}>
			{children}
		</button>
	),
}));

describe("RAGInterface Properties", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("Property 5: UI Response Completeness - displays answer and sources", async () => {
		const mockResult = {
			answer: "Test Answer",
			sources: [
				{
					filename: "test.pdf",
					snippet: "context",
					documentId: "1",
					relevanceScore: 0.9,
				},
			],
			responseTimeMs: 100,
			cache: false,
			confidence: 0.9,
		};

		(mockFetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => mockResult,
		});

		render(<RAGInterface />);

		const input = screen.getByPlaceholderText(/dress code/i);
		const button = screen.getByText("Ask AI");

		fireEvent.change(input, { target: { value: "test query" } });
		fireEvent.click(button);

		const answers = await screen.findAllByText("Test Answer");
		expect(answers[0]).toBeInTheDocument();
		expect(await screen.findByText("test.pdf")).toBeInTheDocument();
	});

	it("Property 6: Session State Persistence - history grows", async () => {
		const mockResult = {
			answer: "A",
			sources: [],
			responseTimeMs: 10,
			confidence: 1,
			cached: false,
		};
		// Configure mock to return persistent result
		(mockFetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => mockResult,
		});

		render(<RAGInterface />);
		const input = screen.getByPlaceholderText(/dress code/i);
		const button = screen.getByText("Ask AI");

		// Query 1
		fireEvent.change(input, { target: { value: "Q1" } });
		fireEvent.click(button);
		// Expect at least one occurrence (answer)
		await screen.findAllByText(/A/);

		// Query 2
		fireEvent.change(input, { target: { value: "Q2" } });
		fireEvent.click(button);

		// Wait for re-render
		await screen.findAllByText(/A/);

		// Check history
		await waitFor(() => {
			expect(screen.getByText("Q1")).toBeInTheDocument();
			expect(screen.getByText("Q2")).toBeInTheDocument();
		});
	});
});

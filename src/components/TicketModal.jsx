import React from "react";
import { jsPDF } from "jspdf";

export default function TicketModal({ ticket, onClose }) {
	if (!ticket) return null;

	function formatDate(d) {
		const dt = d instanceof Date ? d : new Date(d);
		return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;
	}

	function downloadPDF() {
		const bookingDate = ticket.createdAt ? (ticket.createdAt instanceof Date ? ticket.createdAt : new Date(ticket.createdAt)) : new Date();
		const doc = new jsPDF({
			unit: "pt",
			format: "a4",
			compress: true
		});

		// Colors
		const gold = [212, 175, 55];
		const dark = [20, 20, 20];

		// Header
		doc.setFillColor(...gold);
		doc.rect(40, 40, 515, 70, "F"); // gold header bar
		doc.setFontSize(22);
		doc.setTextColor(0, 0, 0);
		doc.text("ANM Real Estate", 60, 90);

		// Ticket Title
		doc.setFontSize(14);
		doc.setTextColor(...gold);
		doc.text("Booking Confirmed", 420, 80);

		// Ticket box
		doc.setDrawColor(...gold);
		doc.rect(40, 120, 515, 220); // border

		doc.setFontSize(12);
		doc.setTextColor(...dark);

		const leftX = 60;
		let y = 150;
		const lineHeight = 20;

		doc.setFont(undefined, "bold");
		doc.text("Ticket Number:", leftX, y);
		doc.setFont(undefined, "normal");
		doc.text(ticket.ticketNumber || "-", leftX + 120, y);
		y += lineHeight;

		doc.setFont(undefined, "bold");
		doc.text("Name:", leftX, y);
		doc.setFont(undefined, "normal");
		doc.text(ticket.name || "-", leftX + 120, y);
		y += lineHeight;

		doc.setFont(undefined, "bold");
		doc.text("Email:", leftX, y);
		doc.setFont(undefined, "normal");
		doc.text(ticket.email || "-", leftX + 120, y);
		y += lineHeight;

		doc.setFont(undefined, "bold");
		doc.text("Mobile:", leftX, y);
		doc.setFont(undefined, "normal");
		doc.text(ticket.phone || "-", leftX + 120, y);
		y += lineHeight;

		doc.setFont(undefined, "bold");
		doc.text("Booking Date & Time:", leftX, y);
		doc.setFont(undefined, "normal");
		doc.text(formatDate(bookingDate), leftX + 150, y);
		y += lineHeight * 1.5;

		// Support info
		doc.setFontSize(11);
		doc.setTextColor(...gold);
		doc.text("Support:", leftX, y);
		doc.setTextColor(...dark);
		doc.text("7396761111", leftX + 70, y);
		y += lineHeight;

		// Footer note
		doc.setFontSize(10);
		doc.setTextColor(120, 120, 120);
		doc.text("Keep this ticket safe. You will be notified if you win.", leftX, y + 10);

		// Save PDF
		const fileName = `ticket-${ticket.ticketNumber || "unknown"}.pdf`;
		doc.save(fileName);
	}

	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
			<div className="bg-zinc-900 rounded-lg shadow-lg p-6 max-w-md w-full border border-zinc-800">
				<div className="flex items-start justify-between">
					<div>
						<div className="text-xs uppercase" style={{ color: "var(--accent)" }}>Booking Confirmed</div>
						<div className="mt-2 text-lg font-bold" style={{ color: "var(--accent)" }}>{ticket.ticketNumber}</div>
					</div>
					<button onClick={onClose} className="text-zinc-400">Close</button>
				</div>

				<div className="mt-4 space-y-2 text-sm text-zinc-300">
					<div><span className="text-zinc-400">Name:</span> {ticket.name || "-"}</div>
					<div><span className="text-zinc-400">Email:</span> {ticket.email || "-"}</div>
					<div><span className="text-zinc-400">Mobile:</span> {ticket.phone || "-"}</div>
					<div><span className="text-zinc-400">Booking Date & Time:</span> {ticket.createdAt ? formatDate(ticket.createdAt) : "-"}</div>
					<div className="mt-2"><span className="text-zinc-400">Support:</span> <span style={{ color: "var(--accent)", fontWeight: 600 }}>7396761111</span></div>
				</div>

				<div className="mt-6 flex items-center justify-end gap-3">
					<button onClick={downloadPDF} className="px-4 py-2 rounded font-semibold" style={{ backgroundColor: "transparent", border: "1px solid var(--accent)", color: "var(--accent)" }}>
						Download PDF
					</button>
					<button onClick={onClose} className="px-4 py-2 rounded font-semibold" style={{ backgroundColor: "var(--accent)", color: "#000" }}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

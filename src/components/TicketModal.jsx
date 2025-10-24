import React from "react";
import { jsPDF } from "jspdf";

// Config: set your UPI ID here or via REACT_APP_UPI_ID env variable at build time.
// Guard access to `process` for environments where it's undefined (E.g., some browsers or Vite setups).
const maybeProcessEnv = (typeof process !== 'undefined' && process.env) ? process.env : (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {});
const UPI_ID = maybeProcessEnv.REACT_APP_UPI_ID || maybeProcessEnv.VITE_UPI_ID || "73967611111@ybl";
// Path where QR image should be placed (public folder): /assets/upi-qr.png
const UPI_QR_PATH = "/assets/upi-qr.png";
// Path where final logo should be placed (public folder): /assets/anm-logo.png
const ANM_LOGO_PATH = "/assets/anm-logo.png";
// Direct PhonePe number (user requested)
const PHONEPE_NUMBER = "7396761111";

export default function TicketModal({ ticket, onClose }) {
	if (!ticket) return null;

	function formatDate(d) {
		const dt = d instanceof Date ? d : new Date(d);
		return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;
	}

	async function downloadPDF() {
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
		// helper: fetch image as dataURL (used for logo and QR)
		function fetchImageAsDataURL(url) {
			return fetch(url)
				.then(r => { if (!r.ok) throw new Error('Image not found'); return r.blob(); })
				.then(blob => new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				}));
		}

		// try to embed logo in header (from public assets)
		try {
			const logoData = await fetchImageAsDataURL(ANM_LOGO_PATH);
			// determine image format from data URL
			const mimeMatch = /^data:(image\/[^;]+);base64,/.exec(logoData);
			const format = mimeMatch ? mimeMatch[1].split('/')[1].toUpperCase() : 'PNG';
			// add image at top-left of header
			try { doc.addImage(logoData, format, 46, 46, 60, 60); } catch (e) { console.warn('Failed to add logo to PDF', e); }
		} catch (e) {
			// fallback to text title if logo missing
			doc.setFontSize(22);
			doc.setTextColor(0, 0, 0);
			doc.text("ANM Real Estate", 120, 90);
		}

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
		doc.text("Aadhaar:", leftX, y);
		doc.setFont(undefined, "normal");
		doc.text(ticket.adhar || "-", leftX + 120, y);
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
	doc.text(PHONEPE_NUMBER, leftX + 70, y);
		y += lineHeight;

		// Payments block: UPI ID and QR
		doc.setFontSize(12);
		doc.setTextColor(...gold);
		doc.text("Payments:", leftX, y);
		doc.setFontSize(11);
		doc.setTextColor(...dark);
		doc.text(`UPI ID: ${UPI_ID}`, leftX + 70, y);
		y += lineHeight;

		// Try to embed QR image if available at runtime (public folder). This requires fetching the image as dataURL.
			// add image if available; await it so PDF contains the QR before saving
			const imgX = leftX + 300;
			const imgY = y - lineHeight;
			const imgSize = 80; // points
			let dataUrl = null;
			try {
				dataUrl = await fetchImageAsDataURL(UPI_QR_PATH);
				const mimeMatchQR = /^data:(image\/[^;]+);base64,/.exec(dataUrl);
				const formatQR = mimeMatchQR ? mimeMatchQR[1].split('/')[1].toUpperCase() : 'PNG';
				try { doc.addImage(dataUrl, formatQR, imgX, imgY, imgSize, imgSize); } catch (e) { console.warn('Failed to add QR to PDF', e); }
			} catch (e) {
				// ignore missing image
			}
			y += lineHeight;

		// Footer note
		doc.setFontSize(10);
		doc.setTextColor(120, 120, 120);
		doc.text("Keep this ticket safe. You will be notified if you win.", leftX, y + 10);
		// Payment note
		doc.setFontSize(9);
		doc.setTextColor(100, 100, 100);
		doc.text(`Payment: UPI ${UPI_ID} (scan QR on ticket)`, leftX, y + 30);
		doc.text(`PhonePe: ${PHONEPE_NUMBER}`, leftX, y + 45);

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
					<div><span className="text-zinc-400">Aadhaar:</span> {ticket.adhar || "-"}</div>
					<div><span className="text-zinc-400">Mobile:</span> {ticket.phone || "-"}</div>
					<div><span className="text-zinc-400">Booking Date & Time:</span> {ticket.createdAt ? formatDate(ticket.createdAt) : "-"}</div>
					<div className="mt-2"><span className="text-zinc-400">Support:</span> <span style={{ color: "var(--accent)", fontWeight: 600 }}>7396761111</span></div>
				</div>

				<div className="mt-4 p-3 rounded border border-zinc-800 bg-black/20">
					<div className="flex items-start gap-4">
						<img src={UPI_QR_PATH} alt="UPI QR" className="w-20 h-20 object-contain rounded" onError={(e) => { e.target.style.display = 'none'; }} />
						<div className="flex-1">
							<div className="text-sm text-zinc-400">Pay via UPI</div>
							<div className="text-lg font-semibold" style={{ color: "var(--accent)" }}>{UPI_ID}</div>
							<div className="mt-2">
								<button onClick={() => { navigator.clipboard && navigator.clipboard.writeText(UPI_ID); alert('UPI ID copied'); }} className="px-3 py-1 rounded border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Copy UPI ID</button>
																<button onClick={() => {
																	// Best-effort open PhonePe specifically (Android intent / iOS scheme), fallback to generic UPI.
																	const paValue = UPI_ID || `${PHONEPE_NUMBER}@upi`;
																	const pa = encodeURIComponent(paValue);
																	const pn = encodeURIComponent('ANM Real Estate');
																	const tn = encodeURIComponent('Ticket Payment');

																	const isAndroid = /Android/i.test(navigator.userAgent || '');
																	const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent || '');

																	// Try app-specific deep link first
																	try {
																		if (isAndroid) {
																			// Android intent URL targeting PhonePe package
																			const intentUri = `intent://upi/pay?pa=${pa}&pn=${pn}&tn=${tn}&cu=INR#Intent;scheme=upi;package=com.phonepe.app;end`;
																			// set a fallback in case intent fails (app not installed)
																			window.location.href = intentUri;
																			setTimeout(() => {
																				// fallback to generic UPI
																				window.location.href = `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&cu=INR`;
																			}, 1500);
																		} else if (isIOS) {
																			// Try phonepe custom scheme on iOS
																			const phonepeScheme = `phonepe://upi/pay?pa=${paValue}&pn=ANM%20Real%20Estate&tn=Ticket%20Payment&cu=INR`;
																			window.location.href = phonepeScheme;
																			setTimeout(() => {
																				window.location.href = `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&cu=INR`;
																			}, 1500);
																		} else {
																			// Desktop fallback to generic UPI handler
																			window.location.href = `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&cu=INR`;
																		}
																	} catch (e) {
																		// Final fallback
																		window.location.href = `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&cu=INR`;
																	}

																	try { navigator.clipboard && navigator.clipboard.writeText(PHONEPE_NUMBER); } catch (e) {}
																}} className="ml-2 px-3 py-1 rounded bg-[color:var(--accent)] text-black">Pay with PhonePe</button>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 flex items-center justify-end gap-3">
					<button onClick={() => downloadPDF().catch(err => { console.error('PDF error', err); alert('Failed to generate PDF'); })} className="px-4 py-2 rounded font-semibold" style={{ backgroundColor: "transparent", border: "1px solid var(--accent)", color: "var(--accent)" }}>
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

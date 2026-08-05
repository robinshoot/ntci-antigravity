import QRCode from 'qrcode';

/**
 * Spec-Compliant Scannable SVG QR Code Generator for NTCI E-KTA & Verification
 */
export function generateQrCodeSvg(data: string, size = 150): string {
  try {
    let svg = '';
    QRCode.toString(
      data,
      {
        type: 'svg',
        width: size,
        margin: 1,
        color: {
          dark: '#111827',
          light: '#ffffff',
        },
      },
      (err, string) => {
        if (!err && string) {
          svg = string;
        }
      }
    );
    return (
      svg ||
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#ffffff"/></svg>`
    );
  } catch (err) {
    console.error('QR Code generation error:', err);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#ffffff"/></svg>`;
  }
}

/**
 * Normalizes scanned QR code payload from E-KTA cards, web links, or hardware scanners.
 * Examples:
 * - "NTCI_VERIFIED_NT-001" -> "NT-001"
 * - "NTCI_MEMBER_NT-002" -> "NT-002"
 * - "https://ntci.or.id/anggota/NT-003" -> "NT-003"
 * - "NT-001\n" -> "NT-001"
 */
export function extractNraFromQrData(rawScannedData: string): string {
  if (!rawScannedData) return '';
  let cleaned = rawScannedData.trim();

  // Strip trailing/leading quotes if present
  cleaned = cleaned.replace(/^['"]|['"]$/g, '');

  // Extract from URL if full URL is scanned
  if (cleaned.includes('/anggota/')) {
    const parts = cleaned.split('/anggota/');
    if (parts[1]) {
      cleaned = parts[1].split('?')[0].split('#')[0].trim();
    }
  }

  // Remove common prefixes (case-insensitive check)
  const prefixes = ['NTCI_VERIFIED_', 'NTCI_MEMBER_', 'NTCI_KTA_', 'NTCI_'];
  for (const prefix of prefixes) {
    if (cleaned.toUpperCase().startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }

  return cleaned;
}

/**
 * Plays an acoustic confirmation audio chime upon successful QR scan
 */
export function playScanBeepSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12); // High chime

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (err) {
    // Ignore audio restriction errors
  }
}


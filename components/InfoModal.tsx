"use client";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

const INSTRUCTIONS = [
  { symbol: "+", byte: "0x2B", color: "#00ff88", desc: "Increment byte at head0" },
  { symbol: "-", byte: "0x2D", color: "#ff4444", desc: "Decrement byte at head0" },
  { symbol: "<", byte: "0x3C", color: "#00ddff", desc: "Move head0 left" },
  { symbol: ">", byte: "0x3E", color: "#ff8800", desc: "Move head0 right" },
  { symbol: "{", byte: "0x7B", color: "#00ffcc", desc: "Move head1 left" },
  { symbol: "}", byte: "0x7D", color: "#ff6655", desc: "Move head1 right" },
  { symbol: ".", byte: "0x2E", color: "#ffdd00", desc: "Copy head0 to head1" },
  { symbol: ",", byte: "0x2C", color: "#ff00ff", desc: "Copy head1 to head0" },
  { symbol: "[", byte: "0x5B", color: "#4488ff", desc: "Loop start (skip if zero)" },
  { symbol: "]", byte: "0x5D", color: "#8844ff", desc: "Loop end (repeat if non-zero)" },
];

export default function InfoModal({ open, onClose }: InfoModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <h2>What You Are Seeing</h2>
        <p>
          A primordial soup of 131,072 random programs. Each 8x8 block on screen
          represents one program (64 bytes of memory). You are viewing 32,400 of
          them. Every epoch, programs are randomly paired, concatenated into a
          single tape, executed, and split back apart. Over thousands of epochs,
          self-replicating programs spontaneously emerge from this random noise
          with no design, no fitness function, and no selection pressure.
        </p>

        <h2>How BFF Works</h2>
        <p>
          BFF is a modified version of Brainfuck where programs and data share the
          same tape of bytes. There are only 10 instructions out of 256 possible
          byte values, meaning roughly 96% of random bytes do nothing. Two
          read/write heads can copy bytes between positions on the tape, which is
          how programs rewrite each other during interactions. When two programs
          are concatenated and executed, one can overwrite the other with a copy of
          itself. That is self-replication.
        </p>

        <h2>The Instruction Set</h2>
        <table className="instruction-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Byte</th>
              <th>Color</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {INSTRUCTIONS.map((inst) => (
              <tr key={inst.symbol}>
                <td className="inst-symbol">{inst.symbol}</td>
                <td className="inst-byte">{inst.byte}</td>
                <td>
                  <span
                    className="color-swatch"
                    style={{ backgroundColor: inst.color }}
                  />
                </td>
                <td>{inst.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>What Happens During an Interaction</h2>
        <p>
          Two programs (A and B) are chosen at random. They are joined end to end
          into a single 128-byte tape. The BFF interpreter runs on this combined
          tape for up to 8,192 steps. Then the tape is split back into two 64-byte
          halves, which replace the originals in the soup. If A contains a
          self-replicator, it may overwrite B with a copy of itself. After
          splitting, both halves are now copies of the replicator.
        </p>

        <h2>Why This Matters</h2>
        <p>
          No one designed these replicators. No fitness function selects for them.
          Mutation is not even required for them to appear. Random programs,
          interacting through a simple mechanism, give rise to self-replicating
          entities purely through the dynamics of computation itself. This suggests
          that self-replication is not a special property that needs to be
          carefully engineered. It may be a natural, almost inevitable consequence
          of computational interactions.
        </p>
        <p>
          If random programs in a digital soup can spontaneously begin to
          replicate, the same principle may help explain how molecular
          self-replicators first arose in Earth&apos;s prebiotic chemistry. The boundary
          between &quot;living&quot; and &quot;non-living&quot; may be better understood as a phase
          transition in computational systems rather than a hard categorical line.
        </p>

        <h2>Credits</h2>
        <p>
          Based on &quot;Computational Life: How Well-formed, Self-replicating Programs
          Emerge from Simple Interaction&quot; by Blaise Aguera y Arcas, Joshua S.
          Gordonson, and Alexander Mordvintsev (Google DeepMind, 2024).
        </p>
      </div>
    </div>
  );
}

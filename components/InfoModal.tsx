"use client";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

const INSTRUCTIONS = [
  { symbol: "+", byte: "0x2B", color: "#00ff88", desc: "Add 1 to the value under head 0" },
  { symbol: "-", byte: "0x2D", color: "#ff4444", desc: "Subtract 1 from the value under head 0" },
  { symbol: "<", byte: "0x3C", color: "#00ddff", desc: "Slide head 0 one position to the left" },
  { symbol: ">", byte: "0x3E", color: "#ff8800", desc: "Slide head 0 one position to the right" },
  { symbol: "{", byte: "0x7B", color: "#00ffcc", desc: "Slide head 1 one position to the left" },
  { symbol: "}", byte: "0x7D", color: "#ff6655", desc: "Slide head 1 one position to the right" },
  { symbol: ".", byte: "0x2E", color: "#ffdd00", desc: "Copy the value at head 0 over to head 1" },
  { symbol: ",", byte: "0x2C", color: "#ff00ff", desc: "Copy the value at head 1 over to head 0" },
  { symbol: "[", byte: "0x5B", color: "#4488ff", desc: "Begin a loop (skip past the end if the value at head 0 is zero)" },
  { symbol: "]", byte: "0x5D", color: "#8844ff", desc: "End of a loop (jump back to the start if the value at head 0 is not zero)" },
];

export default function InfoModal({ open, onClose }: InfoModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <h2>The boundary between life and non-life</h2>
        <p>
          The question of how life first arose from non-living matter is one of
          the deepest unsolved problems in science. We know that at some point
          in Earth&apos;s history, simple molecules began to copy themselves,
          and that this was the first step toward everything we now call life.
          But how? What conditions allow self-replication to emerge where none
          existed before?
        </p>
        <p>
          This simulation offers a striking answer. No one designs the
          replicators that appear here. No fitness function selects for them.
          Mutation is not required. Random programs, interacting through a
          simple mechanism, spontaneously give rise to self-replicating entities
          purely through the dynamics of computation. Self-replication, rather
          than being a special property that must be carefully engineered, may
          be a natural and almost inevitable consequence of computational
          interactions.
        </p>
        <p>
          If random programs in a digital soup can begin to copy themselves,
          the same principle may help explain how molecular self-replicators
          first appeared in Earth&apos;s prebiotic chemistry. The boundary
          between &quot;living&quot; and &quot;non-living&quot; may be better
          understood not as a hard categorical line, but as a phase transition
          in computational systems.
        </p>

        <h2>What you are looking at</h2>
        <p>
          The screen shows a primordial soup of 131,072 tiny programs. Each
          small block of color represents one program: 64 bytes of data stored
          on a strip of memory called a &quot;tape.&quot; Think of each tape as
          a short strand of digital DNA. The colors indicate what types of
          instructions are present in each tape (the legend at the bottom of
          the screen shows the mapping). Most bytes are not instructions at
          all, so most of the display starts as dark noise.
        </p>
        <p>
          You are viewing 32,400 of the 131,072 programs. The rest exist in the
          background and participate in the simulation but are not shown.
        </p>

        <h2>What is a &quot;program&quot; in this context?</h2>
        <p>
          A program here is not software in the conventional sense. It is simply
          a sequence of bytes, like a string of numbers between 0 and 255. The
          computer reads through this sequence one byte at a time. If a byte
          happens to correspond to one of the ten recognized instructions, the
          computer performs that action (move a pointer, copy a value, start a
          loop). If the byte does not match any instruction, the computer skips
          it and moves on. Out of 256 possible byte values, only 10 are
          instructions. This means roughly 96% of random bytes do nothing.
          A random tape is mostly inert, with the occasional functional
          instruction scattered through it.
        </p>
        <p>
          The critical feature is that instructions and data occupy the same
          tape. A program can read, write, and overwrite its own instructions
          as it runs. This is what makes self-modification, and ultimately
          self-replication, possible.
        </p>

        <h2>What are &quot;instructions&quot;?</h2>
        <p>
          An instruction is a single command that tells the computer to do one
          small thing. The language used here, called BFF, has only ten
          instructions. Some move a pointer along the tape. Some change a
          value. Some copy a value from one location to another. And two of
          them create loops, which allow a sequence of actions to repeat.
        </p>
        <p>
          Imagine a tape recorder with two playback heads that can both read
          and write. The instructions slide these heads left and right along
          the tape, and copy data between them. That is the entire mechanism.
          There is nothing more to it than that.
        </p>

        <table className="instruction-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Color</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            {INSTRUCTIONS.map((inst) => (
              <tr key={inst.symbol}>
                <td className="inst-symbol" style={{ color: inst.color }}>
                  {inst.symbol}
                </td>
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

        <h2>How interactions work</h2>
        <p>
          Each step of the simulation picks two programs at random from the
          soup. Their tapes are joined end to end into a single 128-byte
          strip. The computer then runs through this combined tape, executing
          any instructions it encounters, for up to 8,192 steps. After
          execution, the tape is split back into two halves, and those halves
          replace the original programs in the soup.
        </p>
        <p>
          During execution, one program can overwrite the other. If program A
          contains a loop that copies its own bytes into the region occupied by
          program B, then after splitting, both halves are copies of A. That
          is self-replication: A has consumed B and produced a second copy of
          itself. This is conceptually similar to a virus injecting its genetic
          material into a host cell.
        </p>
        <p>
          One epoch consists of 65,536 such interactions, roughly enough for
          each program to participate once on average.
        </p>

        <h2>What to expect</h2>
        <p>
          For the first many epochs, the soup is random noise and nothing
          visually interesting happens. Programs interact and shuffle bytes
          around, but no coherent structure exists yet. Self-replicators
          typically emerge between epochs 1,000 and 5,000. At the current
          simulation speed, this can take anywhere from 8 to 40 minutes of
          running time.
        </p>
        <p>
          About 40% of runs produce replicators within 16,000 epochs. The
          remaining 60% may need more time or a different starting
          configuration. If nothing has emerged after a long run, reload the
          page for a fresh random seed.
        </p>
        <p>
          When a replicator does emerge, you will know. The soup undergoes a
          dramatic, visible phase transition: a wave of color sweeps across the
          display as the replicator copies itself into every program it
          encounters. The diversity of the soup collapses. Where there were
          131,072 unique random programs, there may now be only a handful of
          species, dominated by the replicator and its variants.
        </p>

        <h2>Why this matters</h2>
        <p>
          The result challenges a deep intuition: that self-replication requires
          design. In this system, replicators arise from pure randomness,
          through nothing more than programs interacting with programs. No
          external selection. No engineered fitness landscape. No mutation is
          even necessary, though it accelerates the process. The transition
          from non-life to life, at least in this computational setting,
          appears to be something closer to a law of physics than a lucky
          accident.
        </p>

        <h2>Reference</h2>
        <p>
          Based on &quot;Computational Life: How Well-formed, Self-replicating
          Programs Emerge from Simple Interaction&quot; by Blaise Ag&uuml;era y
          Arcas, Joshua S. Gordonson, and Alexander Mordvintsev (Google
          DeepMind, 2024).
        </p>
      </div>
    </div>
  );
}

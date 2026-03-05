import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { buildPalette } from "./palette";

const VERT_SRC = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG_SRC = `#version 300 es
precision mediump float;
uniform highp usampler2D u_soup;
uniform sampler2D u_palette;
in vec2 v_uv;
out vec4 fragColor;
void main() {
  uint byteVal = texture(u_soup, v_uv).r;
  float lutX = (float(byteVal) + 0.5) / 256.0;
  fragColor = texture(u_palette, vec2(lutX, 0.5));
}`;

export interface Renderer {
  uploadSoup(data: Uint8Array): void;
  draw(): void;
  destroy(): void;
}

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

function createCanvas2DRenderer(canvas: HTMLCanvasElement): Renderer {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
  const pixels = imageData.data;
  const palette = buildPalette();

  return {
    uploadSoup(data: Uint8Array) {
      for (let i = 0; i < data.length; i++) {
        const pOff = data[i] * 4;
        const iOff = i * 4;
        pixels[iOff] = palette[pOff];
        pixels[iOff + 1] = palette[pOff + 1];
        pixels[iOff + 2] = palette[pOff + 2];
        pixels[iOff + 3] = 255;
      }
    },
    draw() {
      ctx.putImageData(imageData, 0, 0);
    },
    destroy() {},
  };
}

export function createRenderer(canvas: HTMLCanvasElement): Renderer {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
  if (!gl) return createCanvas2DRenderer(canvas);

  // Compile program
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
  }
  gl.useProgram(program);

  // Fullscreen quad
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Soup texture (R8UI)
  const soupTex = gl.createTexture()!;
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, soupTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, CANVAS_WIDTH, CANVAS_HEIGHT, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, null);

  // Palette texture (256x1 RGBA)
  const palTex = gl.createTexture()!;
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, palTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const palette = buildPalette();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);

  // Set uniforms
  gl.uniform1i(gl.getUniformLocation(program, "u_soup"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "u_palette"), 1);

  return {
    uploadSoup(data: Uint8Array) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, soupTex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, gl.RED_INTEGER, gl.UNSIGNED_BYTE, data);
    },
    draw() {
      gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      gl.deleteTexture(soupTex);
      gl.deleteTexture(palTex);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, AlertTriangle, TrendingUp } from 'lucide-react';
import ShapeGrid from '@/components/ui/ShapeGrid';
import { Button } from '@/components/ui';
import SimpleGraph, { type DataPoint } from '@/components/ui/SimpleGraph';

// ── Types ─────────────────────────────────────────────────────────────────────
type Shape = 'square' | 'hexagon' | 'circle' | 'triangle';
type Direction = 'right' | 'left' | 'up' | 'down' | 'diagonal';

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-14">
    <h2 className="text-heading-sm font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">{title}</h2>
    {children}
  </section>
);

// ── Demo: ShapeGrid ───────────────────────────────────────────────────────────
const ShapeGridDemo = () => {
  const [shape, setShape] = useState<Shape>('square');
  const [direction, setDirection] = useState<Direction>('diagonal');
  const [speed, setSpeed] = useState(0.4);
  const [squareSize, setSquareSize] = useState(40);
  const [borderColor, setBorderColor] = useState('#7c9dcc');
  const [hoverFillColor, setHoverFillColor] = useState('#3b6fa0');
  const [hoverTrail, setHoverTrail] = useState(5);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Canvas preview */}
      <div className="relative rounded-radius-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-shadow-md" style={{ height: 300 }}>
        <ShapeGrid
          shape={shape} direction={direction} speed={speed}
          squareSize={squareSize} borderColor={borderColor}
          hoverFillColor={hoverFillColor} hoverTrailAmount={hoverTrail}
        />
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-caption px-2.5 py-1 rounded-full backdrop-blur-sm">
          Mueve el mouse aquí
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-radius-2xl border border-slate-200 p-6 shadow-shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Shape</label>
            <select value={shape} onChange={e => setShape(e.target.value as Shape)} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-radius-md text-slate-900 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              {(['square', 'hexagon', 'circle', 'triangle'] as Shape[]).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Direction</label>
            <select value={direction} onChange={e => setDirection(e.target.value as Direction)} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-radius-md text-slate-900 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              {(['right', 'left', 'up', 'down', 'diagonal'] as Direction[]).map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Speed — {speed}</label>
          <input type="range" min="0.1" max="3" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full mt-1 accent-brand-600" />
        </div>
        <div>
          <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Tile Size — {squareSize}px</label>
          <input type="range" min="20" max="80" step="5" value={squareSize} onChange={e => setSquareSize(Number(e.target.value))} className="w-full mt-1 accent-brand-600" />
        </div>
        <div>
          <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Hover Trail — {hoverTrail}</label>
          <input type="range" min="0" max="15" step="1" value={hoverTrail} onChange={e => setHoverTrail(Number(e.target.value))} className="w-full mt-1 accent-brand-600" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Border Color</label>
            <div className="flex gap-2 mt-1">
              <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-10 h-10 rounded-md border border-slate-200 cursor-pointer" />
              <span className="text-body-sm text-slate-500 self-center">{borderColor}</span>
            </div>
          </div>
          <div>
            <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Fill Color</label>
            <div className="flex gap-2 mt-1">
              <input type="color" value={hoverFillColor} onChange={e => setHoverFillColor(e.target.value)} className="w-10 h-10 rounded-md border border-slate-200 cursor-pointer" />
              <span className="text-body-sm text-slate-500 self-center">{hoverFillColor}</span>
            </div>
          </div>
        </div>

        {/* Code snippet */}
        <div className="bg-slate-900 rounded-radius-lg p-4 text-caption text-emerald-400 font-mono leading-relaxed overflow-x-auto">
          {`<ShapeGrid\n  shape="${shape}"\n  direction="${direction}"\n  speed={${speed}}\n  squareSize={${squareSize}}\n  borderColor="${borderColor}"\n  hoverFillColor="${hoverFillColor}"\n  hoverTrailAmount={${hoverTrail}}\n/>`}
        </div>
      </div>
    </div>
  );
};

// ── Demo: SimpleGraph ─────────────────────────────────────────────────────────
const DEFAULT_DATA: DataPoint[] = [
  { label: 'Lun', value: 55 },
  { label: 'Mar', value: 72 },
  { label: 'Mié', value: 48 },
  { label: 'Jue', value: 90 },
  { label: 'Vie', value: 68 },
  { label: 'Sáb', value: 85 },
  { label: 'Dom', value: 100 },
];

const SimpleGraphDemo = () => {
  const [color, setColor] = useState('#f97316');
  const [gradientFrom, setGradientFrom] = useState('#f97316');
  const [height, setHeight] = useState(200);
  const [animated, setAnimated] = useState(true);
  const [showDots, setShowDots] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [dataRaw, setDataRaw] = useState(
    DEFAULT_DATA.map((d) => d.value).join(', ')
  );
  const [key, setKey] = useState(0);

  const parsedData: DataPoint[] = DEFAULT_DATA.map((d, i) => ({
    label: d.label,
    value: Number(dataRaw.split(',')[i]?.trim()) || d.value,
  }));

  const reAnimate = () => setKey((k) => k + 1);

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-colors ${value ? 'bg-brand-500' : 'bg-slate-200'} relative`}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
      </div>
      <span className="text-body-sm text-slate-700">{label}</span>
    </label>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Preview */}
      <div className="bg-white rounded-radius-2xl border border-slate-200 p-6 shadow-shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            <span className="text-body-sm font-semibold text-slate-700">Preview en vivo</span>
          </div>
          <button
            onClick={reAnimate}
            className="text-caption font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 px-2.5 py-1 rounded-radius-md hover:bg-brand-50 transition-colors"
          >
            ↺ Re-animar
          </button>
        </div>
        <SimpleGraph
          key={key}
          data={parsedData}
          color={color}
          gradientFrom={gradientFrom}
          gradientTo="transparent"
          height={height}
          animated={animated}
          showDots={showDots}
          showTooltip={showTooltip}
          formatValue={(v) => `${v}%`}
        />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-radius-2xl border border-slate-200 p-6 shadow-shadow-sm space-y-5">
        {/* Data editor */}
        <div>
          <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">
            Valores (Lun–Dom, separados por coma)
          </label>
          <input
            type="text"
            value={dataRaw}
            onChange={(e) => { setDataRaw(e.target.value); reAnimate(); }}
            className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-radius-md text-slate-900 text-body-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Height */}
        <div>
          <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">
            Altura — {height}px
          </label>
          <input
            type="range" min={80} max={360} step={8} value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full mt-1 accent-brand-600"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Line Color</label>
            <div className="flex gap-2 mt-1 items-center">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-md border border-slate-200 cursor-pointer" />
              <span className="text-body-sm text-slate-400 font-mono">{color}</span>
            </div>
          </div>
          <div>
            <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Gradient Color</label>
            <div className="flex gap-2 mt-1 items-center">
              <input type="color" value={gradientFrom} onChange={(e) => setGradientFrom(e.target.value)}
                className="w-10 h-10 rounded-md border border-slate-200 cursor-pointer" />
              <span className="text-body-sm text-slate-400 font-mono">{gradientFrom}</span>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <Toggle label="Animado" value={animated} onChange={setAnimated} />
          <Toggle label="Mostrar puntos" value={showDots} onChange={setShowDots} />
          <Toggle label="Mostrar tooltip" value={showTooltip} onChange={setShowTooltip} />
        </div>

        {/* Code snippet */}
        <div className="bg-slate-900 rounded-radius-lg p-4 text-caption text-emerald-400 font-mono leading-relaxed overflow-x-auto">
          {`<SimpleGraph\n  data={data}\n  color="${color}"\n  gradientFrom="${gradientFrom}"\n  height={${height}}\n  animated={${animated}}\n  showDots={${showDots}}\n  showTooltip={${showTooltip}}\n/>`}
        </div>
      </div>
    </div>
  );
};

// ── Demo: Buttons ─────────────────────────────────────────────────────────────
const ButtonsDemo = () => (
  <div className="bg-white rounded-radius-2xl border border-slate-200 p-8 shadow-shadow-sm space-y-6">
    <div>
      <p className="text-caption font-semibold text-slate-400 uppercase tracking-wider mb-3">Variants</p>
      <div className="flex flex-wrap gap-3">
        {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map(v => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
      </div>
    </div>
    <div>
      <p className="text-caption font-semibold text-slate-400 uppercase tracking-wider mb-3">Sizes</p>
      <div className="flex flex-wrap items-center gap-3">
        {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
          <Button key={s} size={s}>{s}</Button>
        ))}
      </div>
    </div>
    <div>
      <p className="text-caption font-semibold text-slate-400 uppercase tracking-wider mb-3">States</p>
      <div className="flex flex-wrap gap-3">
        <Button loading>Loading...</Button>
        <Button disabled>Disabled</Button>
        <Button fullWidth>Full Width</Button>
      </div>
    </div>
  </div>
);

// ── Main Demo Page ─────────────────────────────────────────────────────────────
export const Demo = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Dev banner */}
      <div className="bg-amber-400 px-4 py-2 text-center text-amber-900 text-body-sm font-semibold flex items-center justify-center gap-2 sticky top-0 z-50">
        <AlertTriangle className="w-4 h-4" />
        Modo desarrollo — Esta página no está disponible en producción
      </div>

      <div className="container-page max-w-5xl mx-auto py-10 px-4">
        {/* Header */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-600 rounded-radius-lg flex items-center justify-center">
              <Beaker className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-heading-xl font-bold text-slate-900">Playground de componentes</h1>
          </div>
          <p className="text-body-md text-slate-500 ml-13">Explora y configura todos los componentes del Design System en tiempo real.</p>
        </motion.div>

        <Section title="Simple Graph — Gráfica animada con interacciones">
          <SimpleGraphDemo />
        </Section>

        <Section title="ShapeGrid — Animated Background">
          <ShapeGridDemo />
        </Section>

        <Section title="Button — Variantes y estados">
          <ButtonsDemo />
        </Section>

        <Section title="ShapeGrid — Presets rápidos">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Hexágonos', props: { shape: 'hexagon', direction: 'diagonal', borderColor: '#a78bfa', hoverFillColor: '#7c3aed', speed: 0.3, squareSize: 50 } },
              { label: 'Círculos', props: { shape: 'circle', direction: 'right', borderColor: '#34d399', hoverFillColor: '#059669', speed: 0.5, squareSize: 35 } },
              { label: 'Triángulos', props: { shape: 'triangle', direction: 'up', borderColor: '#f472b6', hoverFillColor: '#db2777', speed: 0.6, squareSize: 40 } },
              { label: 'Cuadrados rápidos', props: { shape: 'square', direction: 'left', borderColor: '#fbbf24', hoverFillColor: '#d97706', speed: 1.5, squareSize: 30 } },
            ].map(({ label, props }) => (
              <div key={label} className="rounded-radius-xl overflow-hidden border border-slate-200 shadow-shadow-sm bg-slate-900" style={{ height: 180 }}>
                <div className="relative h-full">
                  <ShapeGrid {...(props as Parameters<typeof ShapeGrid>[0])} hoverTrailAmount={3} />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-caption px-2 py-0.5 rounded-full backdrop-blur-sm">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

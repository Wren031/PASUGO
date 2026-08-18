import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { cn } from '@/utils/cn';
import React from 'react';

export function WelcomeIllustration({ className }: { className?: string }) {
  return (
    <View className={cn('w-full', className)} style={{ aspectRatio: 420 / 320 }}>
      <Svg width="100%" height="100%" viewBox="0 0 420 320">
        <Circle cx={210} cy={158} r={148} fill="#FFEDD5" />
        <Circle cx={352} cy={72} r={46} fill="#FDBA74" opacity={0.4} />
        <Circle cx={352} cy={72} r={22} fill="#FDBA74" opacity={0.45} />
        <Circle cx={64} cy={56} r={36} fill="#F97316" opacity={0.12} />

        <Rect x={44} y={112} width={26} height={64} rx={8} fill="#FDBA74" opacity={0.35} />
        <Rect x={76} y={88} width={34} height={88} rx={10} fill="#FDBA74" opacity={0.35} />
        <Rect x={116} y={126} width={22} height={50} rx={8} fill="#FDBA74" opacity={0.35} />
        <Rect x={144} y={106} width={18} height={70} rx={8} fill="#FDBA74" opacity={0.35} />
        <Rect x={300} y={96} width={30} height={80} rx={10} fill="#FDBA74" opacity={0.35} />
        <Rect x={336} y={122} width={24} height={54} rx={8} fill="#FDBA74" opacity={0.35} />
        <Rect x={262} y={132} width={22} height={44} rx={8} fill="#FDBA74" opacity={0.35} />

        <Path d="M 16 306 Q 130 264 262 288 T 404 268" stroke="#E2E8F0" strokeWidth={34} strokeLinecap="round" fill="none" />
        <Path d="M 16 306 Q 130 264 262 288 T 404 268" stroke="#FFFFFF" strokeWidth={3} strokeDasharray="12 12" strokeLinecap="round" fill="none" opacity={0.9} />

        <Path d="M 92 208 L 128 208" stroke="#FDBA74" strokeWidth={6} strokeLinecap="round" opacity={0.9} />
        <Path d="M 72 226 L 118 226" stroke="#FDBA74" strokeWidth={6} strokeLinecap="round" opacity={0.9} />
        <Path d="M 104 244 L 132 244" stroke="#FDBA74" strokeWidth={6} strokeLinecap="round" opacity={0.9} />

        <Path d="M 284 212 C 300 168 316 172 326 194" stroke="#F97316" strokeWidth={4.5} strokeDasharray="7 9" strokeLinecap="round" fill="none" />

        <Circle cx={156} cy={250} r={21} stroke="#0F172A" strokeWidth={6} fill="none" />
        <Circle cx={156} cy={250} r={5} fill="#0F172A" />
        <Circle cx={270} cy={250} r={21} stroke="#0F172A" strokeWidth={6} fill="none" />
        <Circle cx={270} cy={250} r={5} fill="#0F172A" />
        <Path d="M 138 236 Q 156 214 174 236 Z" fill="#334155" />
        <Path d="M 252 236 Q 270 214 288 236 Z" fill="#334155" />
        <Path d="M 156 250 L 252 250" stroke="#0F172A" strokeWidth={5} strokeLinecap="round" />
        <Rect x={198} y={206} width={52} height={26} rx={13} fill="#F97316" />
        <Rect x={164} y={208} width={36} height={16} rx={8} fill="#C2410C" />
        <Path d="M 270 250 L 270 216" stroke="#0F172A" strokeWidth={5} strokeLinecap="round" />
        <Path d="M 270 216 L 250 208" stroke="#0F172A" strokeWidth={5} strokeLinecap="round" />
        <Circle cx={247} cy={206} r={4} fill="#0F172A" />
        <Rect x={146} y={246} width={18} height={7} rx={3.5} fill="#334155" />

        <Circle cx={202} cy={176} r={15} fill="#F97316" />
        <Rect x={206} y={172} width={16} height={9} rx={4} fill="#0F172A" />
        <Rect x={186} y={190} width={32} height={42} rx={14} fill="#334155" />
        <Path d="M 212 200 L 244 210" stroke="#334155" strokeWidth={7} strokeLinecap="round" />
        <Path d="M 198 228 L 186 248" stroke="#1E293B" strokeWidth={8} strokeLinecap="round" />
        <Circle cx={184} cy={250} r={5} fill="#0F172A" />

        <Path d="M 318 166 A 15 15 0 0 1 348 166 Q 348 152 333 152 Q 318 152 318 166 Z" fill="#0F172A" />
        <Circle cx={333} cy={168} r={15} fill="#FBBF77" />
        <Rect x={318} y={186} width={30} height={36} rx={13} fill="#3B82F6" />
        <Path d="M 320 196 Q 298 186 292 162" stroke="#3B82F6" strokeWidth={8} strokeLinecap="round" fill="none" />
        <Circle cx={291} cy={159} r={5.5} fill="#FBBF77" />
        <Path d="M 326 220 L 322 248" stroke="#334155" strokeWidth={8} strokeLinecap="round" />
        <Path d="M 338 220 L 341 248" stroke="#334155" strokeWidth={8} strokeLinecap="round" />
        <Rect x={344} y={190} width={18} height={22} rx={7} fill="#F59E0B" />

        <Circle cx={333} cy={266} r={8} fill="#22C55E" />
        <Circle cx={333} cy={266} r={3.5} fill="#FFFFFF" />

        <Path d="M 356 132 L 356 148 M 348 140 L 364 140" stroke="#F97316" strokeWidth={3} strokeLinecap="round" />
        <Path d="M 60 142 L 60 158 M 52 150 L 68 150" stroke="#F97316" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      </Svg>
    </View>
  );
}
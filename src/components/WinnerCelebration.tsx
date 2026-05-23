import { Player } from "@/types/player";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Trophy, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface WinnerCelebrationProps {
  winner: Player[];
  loser: Player[];
  variant: "a" | "b";
  onBack: () => void;
}

const WinnerCelebration = ({ winner, loser, variant, onBack }: WinnerCelebrationProps) => {
  const isA = variant === "a";
  const accent = isA ? "hsl(195,85%,40%)" : "hsl(0,72%,45%)";
  const accentSoft = isA ? "hsl(151,67%,40%)" : "hsl(48,100%,50%)";
  const teamName = isA ? "Aserbaidschan" : "Deutschland";
  const loserName = isA ? "Deutschland" : "Aserbaidschan";

  const winnerNames = winner.map((p) => p.name).join(", ");
  const loserNames = loser.map((p) => p.name).join(", ");

  const azText = isA
    ? `🏆 TƏBRİKLƏR! 🏆\n\n${teamName} komandası qalib gəldi! 🇦🇿\n\nQəhrəmanlarımız:\n${winner.map((p) => `⚽ ${p.name}`).join("\n")}\n\nMəğlub komanda (${loserName}):\n${loser.map((p) => `• ${p.name}`).join("\n")}\n\nAachen Uşaqları 💪`
    : `🏆 HERZLICHEN GLÜCKWUNSCH! 🏆\n\n${teamName} hat gewonnen! 🇩🇪\n\nUnsere Helden:\n${winner.map((p) => `⚽ ${p.name}`).join("\n")}\n\nVerlierer-Team (${loserName}):\n${loser.map((p) => `• ${p.name}`).join("\n")}\n\nAachen Ushaqlari 💪`;

  const deText = `🏆 HERZLICHEN GLÜCKWUNSCH! 🏆\n\nTeam ${teamName} hat gewonnen! ${isA ? "🇦🇿" : "🇩🇪"}\n\nUnsere Champions:\n${winner.map((p) => `⚽ ${p.name}`).join("\n")}\n\nGute Leistung auch an Team ${loserName}:\n${loser.map((p) => `• ${p.name}`).join("\n")}\n\n— Aachen Ushaqlari`;

  const shareText = `${azText}\n\n━━━━━━━━━━━━━━\n\n${deText}`;

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Aachen Ushaqlari - Sieger!", text: shareText });
        return;
      } catch {
        // fall through to copy
      }
    }
    handleCopy();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("Kopiert!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Konnte nicht kopieren");
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${accent} 0%, ${accentSoft} 100%)`,
      }}
    >
      {/* Confetti */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * 400, opacity: 0 }}
          animate={{
            y: 900,
            opacity: [0, 1, 1, 0],
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          className="absolute w-2 h-3 rounded-sm"
          style={{
            background: i % 2 === 0 ? "white" : accentSoft,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="sticky top-0 z-10 backdrop-blur-sm bg-black/10 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-white">
            Sieger!
          </h1>
        </div>
      </div>

      <div className="relative max-w-lg mx-auto p-4 space-y-4">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="flex justify-center pt-6"
        >
          <div className="relative">
            <Trophy className="h-32 w-32 text-yellow-300 drop-shadow-2xl" strokeWidth={1.5} />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-yellow-300/40 rounded-full blur-3xl -z-10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white"
        >
          <p className="font-display text-5xl font-black uppercase tracking-wider drop-shadow-lg">
            {teamName}
          </p>
          <p className="font-display text-2xl font-bold mt-2 drop-shadow">
            hat gewonnen!
          </p>
        </motion.div>

        {/* AZ message */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white/95 backdrop-blur p-5 shadow-xl"
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            🇦🇿 Azərbaycanca
          </p>
          <p className="font-display text-2xl font-bold mt-1" style={{ color: accent }}>
            TƏBRİKLƏR!
          </p>
          <p className="text-sm mt-2 leading-relaxed">
            <span className="font-semibold">{teamName}</span> komandası bu gün meydanda
            əzəmət göstərdi və qələbəni qazandı! Qəhrəmanlarımıza alqış! 👏
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {winner.map((p) => (
              <span
                key={p.id}
                className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                style={{ background: accent }}
              >
                ⚽ {p.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* DE message */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl bg-white/95 backdrop-blur p-5 shadow-xl"
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            🇩🇪 Deutsch
          </p>
          <p className="font-display text-2xl font-bold mt-1" style={{ color: accent }}>
            HERZLICHEN GLÜCKWUNSCH!
          </p>
          <p className="text-sm mt-2 leading-relaxed">
            Team <span className="font-semibold">{teamName}</span> hat heute alles
            gegeben und verdient den Sieg geholt! Ein riesiges Bravo an unsere Champions! 🎉
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {winner.map((p) => (
              <span
                key={p.id}
                className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                style={{ background: accent }}
              >
                ⚽ {p.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Auch starke Leistung von {loserName}: {loserNames}
          </p>
        </motion.div>

        {/* Share buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-2 pt-2"
        >
          <Button onClick={handleShare} className="flex-1 bg-white text-foreground hover:bg-white/90 gap-2 h-12 shadow-xl">
            <Share2 className="h-4 w-4" />
            Teilen
          </Button>
          <Button onClick={handleCopy} variant="outline" className="flex-1 bg-transparent text-white border-white hover:bg-white/20 hover:text-white gap-2 h-12">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Kopiert" : "Kopieren"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default WinnerCelebration;

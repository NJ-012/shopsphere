import { motion } from 'framer-motion';

/* ── Shimmer skeleton card matching dark glass theme ── */
function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Image placeholder */}
      <div className="aspect-[4/5] rounded-t-2xl bg-gradient-to-br from-white/5 to-white/[0.02]" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-3/5 rounded-full bg-white/10" />
        <div className="h-5 w-4/5 rounded-full bg-white/10" />
        <div className="h-3 w-2/5 rounded-full bg-white/10" />

        {/* Price */}
        <div className="flex items-center space-x-2 pt-2">
          <div className="h-6 w-20 rounded-full bg-white/10" />
          <div className="h-4 w-14 rounded-full bg-white/5" />
        </div>

        {/* Button placeholder */}
        <div className="h-11 w-full rounded-xl bg-white/5" />
      </div>
    </motion.div>
  );
}

export default SkeletonCard;

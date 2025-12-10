// components/SkillCard.tsx - Reusable Frosted Glass Skill Card

import { motion, Variants } from 'framer-motion';
import { SkillCardProps } from '@/data/experienceData'; // Assuming path is correct

// Item animation variant from the original file
export const cardStaggerItem: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const SkillCard: React.FC<SkillCardProps> = ({ Icon, title, details, iconColor }) => (
    <motion.div
        variants={cardStaggerItem}
        className="
            p-5 rounded-xl text-center
            bg-white/5 backdrop-blur-sm border border-white/10 
            transition-transform duration-300 hover:scale-[1.03] 
            hover:shadow-sky-500/30 shadow-lg cursor-pointer h-full
            flex flex-col justify-center
        "
    >
        <div className={`text-4xl mx-auto mb-3 ${iconColor}`}>
            <Icon />
        </div>
        <h3 className="text-lg font-bold text-sky-400 mb-1 leading-tight">{title}</h3>
        <p className="text-xs text-gray-300 leading-snug">{details}</p>
    </motion.div>
);

export default SkillCard;
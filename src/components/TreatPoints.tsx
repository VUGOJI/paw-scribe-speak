import { Coins } from "lucide-react";

interface TreatPointsProps {
  points: number;
  className?: string;
}

const TreatPoints = ({ points, className = "" }: TreatPointsProps) => {
  return (
    <div className={`treat-point ${className}`}>
      <Coins className="w-4 h-4" />
      <span>{points.toLocaleString()}</span>
    </div>
  );
};

export default TreatPoints;
import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
}
//icon: Icon as argument
const StatsCard = ({bgColor, icon:Icon, iconColor, label, value} : StatsCardProps) => {
  return (
    <Card className="bg-lime-950 border-zinc-700/50 hover:bg-green-900 transition-colors">
      <CardContent className="p-6">
        <div>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${bgColor}`}> {/* bgColor as prop */}
              {/* Icon coming as prop and using it as a component */}
              <Icon className = {`size-6 ${iconColor}`} />
            </div>
          </div>
          <div>
            <p className="text-sm text-lime-300">{label}</p> {/* label as prop */}
            <p className="text-2xl font-bold text-lime-100">{value}</p> {/* value as prop */}
          </div>
        </div>
      </CardContent>

    </Card>
  )
}

export default StatsCard

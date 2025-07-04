const Feature = ({ icon, text }: { icon: JSX.Element; text: string }) => (
  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
    {icon}
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default Feature;

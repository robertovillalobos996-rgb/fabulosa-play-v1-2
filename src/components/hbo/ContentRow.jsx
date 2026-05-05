import { useNavigate } from "react-router-dom";

export default function ContentRow({ title, items, onItemClick }) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 px-6">
      <h2 className="text-white text-lg mb-3">{title}</h2>

      <div className="flex gap-4 overflow-x-auto">
        {items.map((item) => (
          <div key={item.id}
            onClick={() => onItemClick ? onItemClick(item) : navigate(item.path)}
            className="min-w-[200px] h-[120px] bg-gray-800 rounded overflow-hidden cursor-pointer">

            <img src={item.image} className="w-full h-full object-cover"/>
          </div>
        ))}
      </div>
    </div>
  );
}
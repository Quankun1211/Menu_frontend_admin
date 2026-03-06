import FilterCategory from "../../modules/product/component/filter/FilterCategory"
import FilterPrice from "../../modules/product/component/filter/FilterPrice";
import { useState } from "react";
import { Checkbox } from "antd";
import FilterNutrition from "../../modules/product/component/filter/FilterNutrition";
import Button from "../ui/Button";
const Filter = ({categories, priceRange} : {categories: any[], priceRange: any[]}) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [price, setPrice] = useState<[number, number]>([0, priceRange[1] / 2])
  const [nutrition, setNutrition] = useState<string[]>([])

  const handleReset = () => {
    setActiveCategory(null)
    setPrice([0, 1_000_000])
    setNutrition([])
  }

  const handleApplyFilter = () => {
    console.log("Bộ lọc được chọn:", {
      category: activeCategory !== null ? categories[activeCategory] : null,
      priceRange: {
        min: price[0],
        max: price[1],
      },
      nutrition,
    })
  }

  return (
    <div className="sticky top-20 bg-white shadow-sm p-4 rounded-xl">
        <div className='flex justify-between'>
            <p className='font-bold text-xl'>Bộ lọc</p>
            <p onClick={handleReset} className='cursor-pointer text-green-500'>Đặt lại</p>
        </div>
        
        {/* Category filter */}
        <h1 className="mt-6 mb-2 font-bold">Danh mục</h1>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((item, index) => (
            <FilterCategory 
              key={index} 
              icon={item.icon} 
              title={item.title} 
              active={activeCategory === index} 
              onClick={() => setActiveCategory(activeCategory === index ? null : index)}/>
          ))}
        </div>

        {/* Price filter */}
        <h1 className="mt-6 mb-2 font-bold">Mức giá</h1>
        <FilterPrice value={price} onChange={setPrice} priceRange={priceRange}/>

        {/* Demanded filter */}
        <h1 className="mt-6 mb-2 font-bold">Nhu cầu sử dụng</h1>
        <div>
        <FilterNutrition 
          value={nutrition}
          onChange={setNutrition}
        />

        </div>
        <Button onClick={handleApplyFilter} className="w-full rounded-2xl! mt-6 bg-green-500! font-bold! text-white!">
          Áp dụng bộ lọc
        </Button>
    </div>
  )
}

export default Filter

// ☐ Ăn kiêng
// ☐ Eat clean
// ☐ Gia đình 2–3 người
// ☐ Trẻ em
// ☐ Người già
// 5️⃣ Chế độ dinh dưỡng / Đặc tính
// text
// Sao chép mã
// ☐ Hữu cơ
// ☐ Ít béo
// ☐ Giàu protein
// ☐ Không thuốc trừ sâu
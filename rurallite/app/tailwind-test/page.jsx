"use client";
export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {" "}
      <div className="max-w-6xl mx-auto">
        {" "}
        {/* Header */}{" "}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          {" "}
          <h1 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            Tailwind CSS Test Page{" "}
          </h1>{" "}
          <p className="text-center text-slate-600 text-lg">
            {" "}
            Testing all Tailwind features and custom colors{" "}
          </p>{" "}
        </div>{" "}
        {/* Colors Test - Standard Tailwind */}{" "}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Standard Tailwind Colors
          </h2>{" "}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {" "}
            <div className="bg-red-500 text-white p-4 rounded-lg text-center font-semibold">
              Red-500
            </div>{" "}
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center font-semibold">
              Blue-500
            </div>{" "}
            <div className="bg-green-500 text-white p-4 rounded-lg text-center font-semibold">
              Green-500
            </div>{" "}
            <div className="bg-yellow-500 text-white p-4 rounded-lg text-center font-semibold">
              Yellow-500
            </div>{" "}
            <div className="bg-purple-500 text-white p-4 rounded-lg text-center font-semibold">
              Purple-500
            </div>{" "}
            <div className="bg-pink-500 text-white p-4 rounded-lg text-center font-semibold">
              Pink-500
            </div>{" "}
            <div className="bg-orange-500 text-white p-4 rounded-lg text-center font-semibold">
              Orange-500
            </div>{" "}
            <div className="bg-cyan-500 text-white p-4 rounded-lg text-center font-semibold">
              Cyan-500
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Custom Colors Test - Brown & Beige */}{" "}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Custom Brown & Beige Colors
          </h2>{" "}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {" "}
            <div className="bg-brown-100 text-brown-900 p-4 rounded-lg text-center font-semibold border-2 border-brown-300">
              {" "}
              Brown-100{" "}
            </div>{" "}
            <div className="bg-brown-300 text-brown-900 p-4 rounded-lg text-center font-semibold">
              {" "}
              Brown-300{" "}
            </div>{" "}
            <div className="bg-brown-500 text-white p-4 rounded-lg text-center font-semibold">
              {" "}
              Brown-500{" "}
            </div>{" "}
            <div className="bg-brown-700 text-white p-4 rounded-lg text-center font-semibold">
              {" "}
              Brown-700{" "}
            </div>{" "}
            <div className="bg-brown-900 text-white p-4 rounded-lg text-center font-semibold">
              {" "}
              Brown-900{" "}
            </div>{" "}
            <div className="bg-beige-100 text-brown-900 p-4 rounded-lg text-center font-semibold border-2 border-beige-300">
              {" "}
              Beige-100{" "}
            </div>{" "}
            <div className="bg-beige-200 text-brown-900 p-4 rounded-lg text-center font-semibold">
              {" "}
              Beige-200{" "}
            </div>{" "}
            <div className="bg-beige-300 text-brown-900 p-4 rounded-lg text-center font-semibold">
              {" "}
              Beige-300{" "}
            </div>{" "}
            <div className="bg-beige-400 text-brown-900 p-4 rounded-lg text-center font-semibold">
              {" "}
              Beige-400{" "}
            </div>{" "}
            <div className="bg-beige-500 text-white p-4 rounded-lg text-center font-semibold">
              {" "}
              Beige-500{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Gradients Test */}{" "}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Gradient Backgrounds
          </h2>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-lg text-center font-bold">
              {" "}
              Blue to Purple{" "}
            </div>{" "}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-lg text-center font-bold">
              {" "}
              Orange to Red{" "}
            </div>{" "}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-lg text-center font-bold">
              {" "}
              Green to Blue{" "}
            </div>{" "}
            <div className="bg-gradient-to-br from-brown-600 to-brown-400 text-white p-8 rounded-lg text-center font-bold">
              {" "}
              Brown Gradient{" "}
            </div>{" "}
            <div className="bg-gradient-to-br from-beige-100 to-beige-400 text-brown-900 p-8 rounded-lg text-center font-bold border-2 border-beige-500">
              {" "}
              Beige Gradient{" "}
            </div>{" "}
            <div className="bg-gradient-to-br from-orange-600 to-amber-600 text-white p-8 rounded-lg text-center font-bold">
              {" "}
              Orange to Amber{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Typography Test */}{" "}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Typography
          </h2>{" "}
          <div className="space-y-4">
            {" "}
            <p className="text-xs text-slate-600">
              Extra Small Text (text-xs)
            </p>{" "}
            <p className="text-sm text-slate-600">Small Text (text-sm)</p>{" "}
            <p className="text-base text-slate-600">Base Text (text-base)</p>{" "}
            <p className="text-lg text-slate-600">Large Text (text-lg)</p>{" "}
            <p className="text-xl text-slate-600">Extra Large Text (text-xl)</p>{" "}
            <p className="text-2xl font-bold text-slate-800">
              2XL Bold Text (text-2xl font-bold)
            </p>{" "}
            <p className="text-3xl font-black text-slate-800">
              3XL Black Text (text-3xl font-black)
            </p>{" "}
            <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Gradient Text (bg-clip-text){" "}
            </p>{" "}
          </div>{" "}
        </section>{" "}
        {/* Spacing & Layout Test */}{" "}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Spacing & Flexbox
          </h2>{" "}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {" "}
            <div className="bg-blue-500 text-white px-6 py-3 rounded-lg">
              Flex Item 1
            </div>{" "}
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg">
              Flex Item 2
            </div>{" "}
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg">
              Flex Item 3
            </div>{" "}
            <div className="bg-purple-500 text-white px-6 py-3 rounded-lg">
              Flex Item 4
            </div>{" "}
          </div>{" "}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {" "}
            <div className="bg-orange-100 p-6 rounded-lg text-center">
              Grid 1
            </div>{" "}
            <div className="bg-orange-200 p-6 rounded-lg text-center">
              Grid 2
            </div>{" "}
            <div className="bg-orange-300 p-6 rounded-lg text-center">
              Grid 3
            </div>{" "}
            <div className="bg-orange-400 p-6 rounded-lg text-center text-white">
              Grid 4
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Borders & Shadows Test */}{" "}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Borders & Shadows
          </h2>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {" "}
            <div className="border-4 border-blue-500 p-6 rounded-lg text-center">
              {" "}
              <p className="font-semibold">Border-4</p>{" "}
            </div>{" "}
            <div className="shadow-lg p-6 rounded-lg text-center bg-white">
              {" "}
              <p className="font-semibold">Shadow-lg</p>{" "}
            </div>{" "}
            <div className="shadow-2xl p-6 rounded-lg text-center bg-white">
              {" "}
              <p className="font-semibold">Shadow-2xl</p>{" "}
            </div>{" "}
            <div className="border-2 border-brown-500 p-6 rounded-lg text-center">
              {" "}
              <p className="font-semibold">Brown Border</p>{" "}
            </div>{" "}
            <div className="ring-4 ring-purple-500 p-6 rounded-lg text-center">
              {" "}
              <p className="font-semibold">Ring-4 Purple</p>{" "}
            </div>{" "}
            <div className="border-t-4 border-orange-500 p-6 rounded-lg text-center bg-orange-50">
              {" "}
              <p className="font-semibold">Border-t-4</p>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Hover & Transitions Test */}{" "}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Hover Effects & Transitions
          </h2>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {" "}
            <button className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-600 transition-colors">
              {" "}
              Hover Color Change{" "}
            </button>{" "}
            <button className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:scale-110 transform transition-transform">
              {" "}
              Hover Scale Up{" "}
            </button>{" "}
            <button className="bg-purple-500 text-white px-8 py-4 rounded-lg font-bold hover:shadow-2xl hover:-translate-y-1 transform transition-all">
              {" "}
              Hover Lift & Shadow{" "}
            </button>{" "}
            <button className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold hover:rotate-3 transform transition-transform">
              {" "}
              Hover Rotate{" "}
            </button>{" "}
            <button className="bg-brown-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-brown-700 transition-all duration-300">
              {" "}
              Brown Hover (Custom){" "}
            </button>{" "}
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg font-bold hover:from-pink-600 hover:to-purple-600 transition-all">
              {" "}
              Gradient Hover{" "}
            </button>{" "}
          </div>{" "}
        </section>{" "}
        {/* Responsive Test */}{" "}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Responsive Design Test
          </h2>{" "}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-lg">
            {" "}
            <p className="text-sm md:text-2xl lg:text-4xl font-bold text-center">
              {" "}
              Resize window to see text change: Small → Medium → Large{" "}
            </p>{" "}
          </div>{" "}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {" "}
            <div className="bg-red-400 p-4 rounded text-center text-white font-semibold">
              1 col on mobile
            </div>{" "}
            <div className="bg-blue-400 p-4 rounded text-center text-white font-semibold">
              2 cols on sm
            </div>{" "}
            <div className="bg-green-400 p-4 rounded text-center text-white font-semibold">
              3 cols on md
            </div>{" "}
            <div className="bg-purple-400 p-4 rounded text-center text-white font-semibold">
              4 cols on lg
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Detailed Layout Tests */}{" "}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Layout & Alignment Tests
          </h2>{" "}
          {/* Padding Test */}{" "}
          <div className="mb-8">
            {" "}
            <h3 className="text-xl font-bold mb-4 text-slate-700">
              Padding Test
            </h3>{" "}
            <div className="flex gap-4 flex-wrap">
              {" "}
              <div className="bg-blue-100 p-0 border-2 border-blue-500">
                {" "}
                <span className="bg-blue-500 text-white px-2 py-1 text-sm">
                  p-0
                </span>{" "}
              </div>{" "}
              <div className="bg-blue-100 p-2 border-2 border-blue-500">
                {" "}
                <span className="bg-blue-500 text-white px-2 py-1 text-sm">
                  p-2
                </span>{" "}
              </div>{" "}
              <div className="bg-blue-100 p-4 border-2 border-blue-500">
                {" "}
                <span className="bg-blue-500 text-white px-2 py-1 text-sm">
                  p-4
                </span>{" "}
              </div>{" "}
              <div className="bg-blue-100 p-8 border-2 border-blue-500">
                {" "}
                <span className="bg-blue-500 text-white px-2 py-1 text-sm">
                  p-8
                </span>{" "}
              </div>{" "}
              <div className="bg-blue-100 p-12 border-2 border-blue-500">
                {" "}
                <span className="bg-blue-500 text-white px-2 py-1 text-sm">
                  p-12
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Margin Test */}{" "}
          <div className="mb-8">
            {" "}
            <h3 className="text-xl font-bold mb-4 text-slate-700">
              Margin Test
            </h3>{" "}
            <div className="bg-slate-100 p-4">
              {" "}
              <div className="bg-red-500 text-white px-4 py-2 m-0 inline-block">
                m-0
              </div>{" "}
              <div className="bg-red-500 text-white px-4 py-2 m-2 inline-block">
                m-2
              </div>{" "}
              <div className="bg-red-500 text-white px-4 py-2 m-4 inline-block">
                m-4
              </div>{" "}
              <div className="bg-red-500 text-white px-4 py-2 m-8 inline-block">
                m-8
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Flexbox Alignment Test */}{" "}
          <div className="mb-8">
            {" "}
            <h3 className="text-xl font-bold mb-4 text-slate-700">
              Flexbox Alignment
            </h3>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">justify-start</p>{" "}
              <div className="flex justify-start gap-2 bg-slate-100 p-4">
                {" "}
                <div className="bg-purple-500 text-white px-4 py-2">
                  Item 1
                </div>{" "}
                <div className="bg-purple-500 text-white px-4 py-2">Item 2</div>{" "}
                <div className="bg-purple-500 text-white px-4 py-2">
                  Item 3
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">justify-center</p>{" "}
              <div className="flex justify-center gap-2 bg-slate-100 p-4">
                {" "}
                <div className="bg-green-500 text-white px-4 py-2">
                  Item 1
                </div>{" "}
                <div className="bg-green-500 text-white px-4 py-2">Item 2</div>{" "}
                <div className="bg-green-500 text-white px-4 py-2">
                  Item 3
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">justify-end</p>{" "}
              <div className="flex justify-end gap-2 bg-slate-100 p-4">
                {" "}
                <div className="bg-orange-500 text-white px-4 py-2">
                  Item 1
                </div>{" "}
                <div className="bg-orange-500 text-white px-4 py-2">Item 2</div>{" "}
                <div className="bg-orange-500 text-white px-4 py-2">
                  Item 3
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">
                justify-between
              </p>{" "}
              <div className="flex justify-between gap-2 bg-slate-100 p-4">
                {" "}
                <div className="bg-blue-500 text-white px-4 py-2">
                  Item 1
                </div>{" "}
                <div className="bg-blue-500 text-white px-4 py-2">Item 2</div>{" "}
                <div className="bg-blue-500 text-white px-4 py-2">
                  Item 3
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">
                items-center (vertical alignment)
              </p>{" "}
              <div className="flex items-center gap-2 bg-slate-100 p-4 h-32">
                {" "}
                <div className="bg-pink-500 text-white px-4 py-2">
                  Short
                </div>{" "}
                <div className="bg-pink-500 text-white px-4 py-8">Tall</div>{" "}
                <div className="bg-pink-500 text-white px-4 py-2">
                  Short
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Grid Layout Test */}{" "}
          <div className="mb-8">
            {" "}
            <h3 className="text-xl font-bold mb-4 text-slate-700">
              Grid Layout Test
            </h3>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">
                grid-cols-3 gap-4
              </p>{" "}
              <div className="grid grid-cols-3 gap-4">
                {" "}
                <div className="bg-cyan-500 text-white p-4 text-center">
                  1
                </div>{" "}
                <div className="bg-cyan-500 text-white p-4 text-center">2</div>{" "}
                <div className="bg-cyan-500 text-white p-4 text-center">3</div>{" "}
                <div className="bg-cyan-500 text-white p-4 text-center">4</div>{" "}
                <div className="bg-cyan-500 text-white p-4 text-center">5</div>{" "}
                <div className="bg-cyan-500 text-white p-4 text-center">
                  6
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">
                grid-cols-4 gap-6
              </p>{" "}
              <div className="grid grid-cols-4 gap-6">
                {" "}
                <div className="bg-purple-500 text-white p-4 text-center">
                  A
                </div>{" "}
                <div className="bg-purple-500 text-white p-4 text-center">
                  B
                </div>{" "}
                <div className="bg-purple-500 text-white p-4 text-center">
                  C
                </div>{" "}
                <div className="bg-purple-500 text-white p-4 text-center">
                  D
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">
                grid-cols-2 md:grid-cols-4 gap-3
              </p>{" "}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {" "}
                <div className="bg-orange-500 text-white p-4 text-center">
                  1
                </div>{" "}
                <div className="bg-orange-500 text-white p-4 text-center">
                  2
                </div>{" "}
                <div className="bg-orange-500 text-white p-4 text-center">
                  3
                </div>{" "}
                <div className="bg-orange-500 text-white p-4 text-center">
                  4
                </div>{" "}
                <div className="bg-orange-500 text-white p-4 text-center">
                  5
                </div>{" "}
                <div className="bg-orange-500 text-white p-4 text-center">
                  6
                </div>{" "}
                <div className="bg-orange-500 text-white p-4 text-center">
                  7
                </div>{" "}
                <div className="bg-orange-500 text-white p-4 text-center">
                  8
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Width & Height Test */}{" "}
          <div className="mb-8">
            {" "}
            <h3 className="text-xl font-bold mb-4 text-slate-700">
              Width & Height Test
            </h3>{" "}
            <div className="space-y-4">
              {" "}
              <div className="w-1/4 bg-blue-500 text-white p-2 text-center">
                w-1/4
              </div>{" "}
              <div className="w-1/2 bg-green-500 text-white p-2 text-center">
                w-1/2
              </div>{" "}
              <div className="w-3/4 bg-yellow-500 text-white p-2 text-center">
                w-3/4
              </div>{" "}
              <div className="w-full bg-red-500 text-white p-2 text-center">
                w-full
              </div>{" "}
              <div className="flex gap-4">
                {" "}
                <div className="w-20 h-20 bg-purple-500 text-white flex items-center justify-center text-sm">
                  w-20 h-20
                </div>{" "}
                <div className="w-32 h-32 bg-pink-500 text-white flex items-center justify-center text-sm">
                  w-32 h-32
                </div>{" "}
                <div className="w-48 h-48 bg-indigo-500 text-white flex items-center justify-center text-sm">
                  w-48 h-48
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Text Alignment Test */}{" "}
          <div className="mb-8">
            {" "}
            <h3 className="text-xl font-bold mb-4 text-slate-700">
              Text Alignment
            </h3>{" "}
            <div className="space-y-4">
              {" "}
              <div className="bg-slate-100 p-4 text-left border-l-4 border-blue-500">
                {" "}
                <p className="font-semibold">text-left</p>{" "}
                <p>This text is aligned to the left</p>{" "}
              </div>{" "}
              <div className="bg-slate-100 p-4 text-center border-l-4 border-green-500">
                {" "}
                <p className="font-semibold">text-center</p>{" "}
                <p>This text is centered</p>{" "}
              </div>{" "}
              <div className="bg-slate-100 p-4 text-right border-l-4 border-orange-500">
                {" "}
                <p className="font-semibold">text-right</p>{" "}
                <p>This text is aligned to the right</p>{" "}
              </div>{" "}
              <div className="bg-slate-100 p-4 text-justify border-l-4 border-purple-500">
                {" "}
                <p className="font-semibold">text-justify</p>{" "}
                <p>
                  This text is justified. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Position Test */}{" "}
          <div className="mb-8">
            {" "}
            <h3 className="text-xl font-bold mb-4 text-slate-700">
              Position Test
            </h3>{" "}
            <div className="relative bg-slate-100 h-64 border-2 border-slate-300">
              {" "}
              <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 text-sm">
                top-0 left-0
              </div>{" "}
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm">
                top-0 right-0
              </div>{" "}
              <div className="absolute bottom-0 left-0 bg-green-500 text-white px-3 py-1 text-sm">
                bottom-0 left-0
              </div>{" "}
              <div className="absolute bottom-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm">
                bottom-0 right-0
              </div>{" "}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 text-sm font-bold">
                {" "}
                Centered (translate){" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Space & Gap Test */}{" "}
          <div className="mb-8">
            {" "}
            <h3 className="text-xl font-bold mb-4 text-slate-700">
              Space & Gap Test
            </h3>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">
                space-x-2 (horizontal spacing)
              </p>{" "}
              <div className="flex space-x-2">
                {" "}
                <div className="bg-red-500 text-white px-4 py-2">A</div>{" "}
                <div className="bg-red-500 text-white px-4 py-2">B</div>{" "}
                <div className="bg-red-500 text-white px-4 py-2">C</div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">space-x-8</p>{" "}
              <div className="flex space-x-8">
                {" "}
                <div className="bg-blue-500 text-white px-4 py-2">A</div>{" "}
                <div className="bg-blue-500 text-white px-4 py-2">B</div>{" "}
                <div className="bg-blue-500 text-white px-4 py-2">C</div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">
                gap-4 (flexbox gap)
              </p>{" "}
              <div className="flex gap-4">
                {" "}
                <div className="bg-green-500 text-white px-4 py-2">
                  Item 1
                </div>{" "}
                <div className="bg-green-500 text-white px-4 py-2">Item 2</div>{" "}
                <div className="bg-green-500 text-white px-4 py-2">
                  Item 3
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mb-4">
              {" "}
              <p className="text-sm text-slate-600 mb-2">gap-8</p>{" "}
              <div className="flex gap-8">
                {" "}
                <div className="bg-purple-500 text-white px-4 py-2">
                  Item 1
                </div>{" "}
                <div className="bg-purple-500 text-white px-4 py-2">Item 2</div>{" "}
                <div className="bg-purple-500 text-white px-4 py-2">
                  Item 3
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Max Width & Container Test */}{" "}
          <div className="mb-8">
            {" "}
            <h3 className="text-xl font-bold mb-4 text-slate-700">
              Max Width Test
            </h3>{" "}
            <div className="space-y-4">
              {" "}
              <div className="max-w-xs bg-blue-100 p-4 border-2 border-blue-500">
                {" "}
                <p className="text-sm font-semibold">
                  max-w-xs (20rem / 320px)
                </p>{" "}
              </div>{" "}
              <div className="max-w-sm bg-green-100 p-4 border-2 border-green-500">
                {" "}
                <p className="text-sm font-semibold">
                  max-w-sm (24rem / 384px)
                </p>{" "}
              </div>{" "}
              <div className="max-w-md bg-yellow-100 p-4 border-2 border-yellow-500">
                {" "}
                <p className="text-sm font-semibold">
                  max-w-md (28rem / 448px)
                </p>{" "}
              </div>{" "}
              <div className="max-w-lg bg-orange-100 p-4 border-2 border-orange-500">
                {" "}
                <p className="text-sm font-semibold">
                  max-w-lg (32rem / 512px)
                </p>{" "}
              </div>{" "}
              <div className="max-w-2xl bg-red-100 p-4 border-2 border-red-500">
                {" "}
                <p className="text-sm font-semibold">
                  max-w-2xl (42rem / 672px)
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Status Indicator */}{" "}
        <div className="bg-green-500 text-white rounded-2xl shadow-2xl p-8 text-center">
          {" "}
          <h3 className="text-3xl font-black mb-2">
            ✅ Tailwind CSS is Working!
          </h3>{" "}
          <p className="text-lg opacity-90">
            {" "}
            If you can see styled colors, gradients, spacing, layouts, and
            alignments working properly, Tailwind is configured correctly.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

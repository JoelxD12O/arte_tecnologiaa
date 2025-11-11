import React, { useState } from 'react';

const ReelComponent: React.FC = () => {
  const [backgroundColor] = useState<string>(
    'linear-gradient(160deg, #ff2d55, #007aff)'
  );

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className="w-96 h-[45rem] rounded-2xl shadow-2xl transition-all mb-20"
        style={{ background: backgroundColor }}
      ></div>
    </div>
  );
};

export default ReelComponent;
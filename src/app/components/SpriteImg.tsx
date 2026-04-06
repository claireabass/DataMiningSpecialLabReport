import { useState } from 'react';

interface SpriteImgProps {
  id: number;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function SpriteImg({ id, size = 120, className = '', style = {} }: SpriteImgProps) {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <img
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
      alt=""
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        ...style,
      }}
      onError={() => setError(true)}
    />
  );
}

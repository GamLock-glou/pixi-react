import React, { useCallback, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { ENV } from "pixi.js";
import { Sprite, Stage } from "@pixi/react";
import cena from "./assets/cena.webp";
import scala from "./assets/scala.png";
import "./App.css";

PIXI.settings.RESOLUTION = window.devicePixelRatio;

PIXI.settings.PREFER_ENV = ENV.WEBGL_LEGACY;

const useDrag = ({ x, y }: { x: number; y: number }) => {
  const sprite = useRef<PIXI.Sprite>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ x, y });

  const onDown = React.useCallback(() => setIsDragging(true), []);
  const onUp = React.useCallback(() => setIsDragging(false), []);
  const onMove = React.useCallback(
    (e: PIXI.FederatedPointerEvent) => {
      if (isDragging && sprite.current) {
        setPosition(e.data.getLocalPosition(sprite.current.parent));
      }
    },
    [isDragging, setPosition]
  );

  return {
    ref: sprite,
    interactive: true,
    pointerdown: onDown,
    pointerup: onUp,
    pointerupoutside: onUp,
    pointermove: onMove,
    // alpha: isDragging ? 0.5 : 1,
    anchor: 0.5,
    position,
  };
};

const DraggableBunny = ({ x = 400, y = 300, ...props }) => {
  const bind = useDrag({ x, y });
  return (
    <Sprite
      image={
        props.image ??
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
      }
      scale={4}
      {...bind}
      {...props}
    />
  );
};

interface ISpriteItem extends IItem {
  id: number;
}

const App = () => {
  const [items, setItems] = useState<ISpriteItem[]>([]);
  const addItem = useCallback((item: IItem) => {
    const id = Date.now()
    setItems(pr => [...pr, {id, ...item}]);
  }, []);
  return (
    <div className="app">
      <Items addItem={addItem} />
      <div className="conva">
        <Stage
          width={window.innerWidth}
          options={{ background: "red", width: 1000 }}
          height={window.innerHeight}
        >
          {
            items.map((item, index) => <DraggableBunny key={item.id} x={300*index} {...item} />)
          }
        </Stage>
      </div>
    </div>
  );
};


// Items

interface IItem {
  name: string,
  image: string,
  width: number,
  height: number,
}

const items: IItem[] = [
  {
    name: "cena",
    image: cena,
    width: 300,
    height: 300,
  },
  {
    name: "scala",
    image: scala,
    width: 300,
    height: 300,
  }
]

const Items = ({addItem}: {addItem: (addItem: IItem) => void}) => {
  return <div className="list">
    {items.map((item) => <div onClick={() => addItem(item)} key={item.name} className="list__item">
      <div className="list__item_name">{item.name}</div>
      <img src={item.image} alt={item.name} className="list__item_image" />
    </div>)}
  </div>;
};

export default App;

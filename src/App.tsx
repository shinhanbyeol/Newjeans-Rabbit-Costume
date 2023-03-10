import React, { useState, useRef, useEffect } from 'react';
import Style from './App.module.scss';
import Rabbit from './Rabbit';
import { SketchPicker } from 'react-color';
import Draggable from 'react-draggable';
import { on } from 'events';

function App(): JSX.Element {
  const [rabbitColor, setRabbitColor] = useState('#000000');
  const colorPicker = useRef<HTMLDivElement>(null);
  const clothesPicker = useRef<HTMLDivElement>(null);
  const [fashionItems, setItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dropedFiles, setDropedFiles] = useState<File[] | null>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const itemsSettingRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    console.log(fashionItems);
  }, [fashionItems]);

  useEffect(() => {
    if (!dropedFiles) return;
    const fileUrlArray = dropedFiles.map((file) => URL.createObjectURL(file));
    setItems([...fashionItems, ...fileUrlArray]);
    setDropedFiles(null);
  }, [dropedFiles]);

  const handleWidthChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    itemsRef.current[index].style.width = e.target.value + 'px';
  };

  const handleHeihgtChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    itemsRef.current[index].style.height = e.target.value + 'px';
  };

  const handleRotateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    itemsRef.current[index].style.transform = `rotate(${e.target.value}deg)`;
  };

  return (
    <div className={Style.App}>
      <h1>Newjeans Rabbit Costume</h1>
      <div className={Style.RabbitContainer}>
        <div className={Style.DragableItemContainer}>
          {selectedItems.map((item, index) => (
            <>
              <Draggable>
                <div className={Style.DragableItem}>
                  <div
                    className={Style.Image}
                    ref={(el) => {
                      itemsRef.current[index] = el!;
                    }}
                    style={{
                      width: '300px',
                      height: '300px',
                      backgroundImage: `url(${item})`,
                    }}
                    onDoubleClick={() => {
                      const toggle =
                        itemsSettingRef.current[index].style.display;
                      itemsSettingRef.current[index].style.display =
                        toggle === 'none' ? 'block' : 'none';
                      itemsRef.current[index].style.border =
                        toggle === 'none' ? 'dashed 1px #485297' : 'none';
                    }}
                  />
                  <div
                    className={Style.ItemSetting}
                    ref={(el) => {
                      itemsSettingRef.current[index] = el!;
                    }}
                  >
                    <label>Settings</label>
                    <br />
                    <label>w:</label>
                    <input
                      defaultValue={300}
                      type="number"
                      placeholder="width"
                      onChange={(e) => {
                        handleWidthChange(e, index);
                      }}
                    />
                    <label>h:</label>
                    <input
                      defaultValue={300}
                      type="number"
                      placeholder="height"
                      onChange={(e) => {
                        handleHeihgtChange(e, index);
                      }}
                    />
                    <label>rotate</label>
                    <input
                      defaultValue={0}
                      type="number"
                      placeholder="rotate"
                      onChange={(e) => {
                        handleRotateChange(e, index);
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const newItems = selectedItems.filter(
                          (item, i) => i !== index,
                        );
                        setSelectedItems(newItems);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Draggable>
            </>
          ))}
        </div>
        <Rabbit color={rabbitColor} />
      </div>
      <p className={Style.ToolContainer}>
        <div ref={colorPicker} className={Style.ColorPickerContainer}>
          <SketchPicker
            className={Style.ColorPicker}
            color={rabbitColor}
            onChange={(color) => setRabbitColor(color.hex)}
          />
        </div>
        <div ref={clothesPicker} className={Style.ClothesPickerContainer}>
          <div className={Style.ClothesPicker}>
            <div className={Style.ItemGrid}>
              {fashionItems.map((item, index) => (
                <>
                  <div
                    className={Style.Item}
                    onClick={() => {
                      setSelectedItems([...selectedItems, item]);
                    }}
                  >
                    <img src={item}></img>
                  </div>
                </>
              ))}
            </div>
            <p>
              <input
                value={''}
                type="file"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const fileArray = Array.from(files);
                    setDropedFiles(fileArray);
                  }
                }}
              />
            </p>
          </div>
        </div>
      </p>
      <p className={Style.RabitMenu}>
        <label>change rabbit color</label>
        <button
          type="button"
          className={Style.ColorButton}
          style={{ backgroundColor: rabbitColor }}
          onClick={() => {
            const toggle: 'none' | 'block' =
              colorPicker.current?.style.display === 'none' ? 'block' : 'none';
            colorPicker.current!.style.display = toggle;
          }}
        />
        <label>clothes</label>
        <button
          className={Style.ClothesButton}
          onClick={() => {
            const toggle: 'none' | 'flex' =
              clothesPicker.current?.style.display === 'none' ? 'flex' : 'none';
            clothesPicker.current!.style.display = toggle;
          }}
        >
          👕
        </button>
      </p>
    </div>
  );
}

export default App;

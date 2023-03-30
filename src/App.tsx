import React, { useState, useRef, useEffect } from 'react';
import Style from './App.module.scss';
import Rabbit from './Rabbit';
import { SketchPicker } from 'react-color';
import Draggable from 'react-draggable';
import { on } from 'events';
import { fabric } from 'fabric';
import { abort } from 'process';

function App(): JSX.Element {
  const [rabbitColor, setRabbitColor] = useState('#000000');
  const colorPicker = useRef<HTMLDivElement>(null);
  const clothesPicker = useRef<HTMLDivElement>(null);
  const [fashionItems, setItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dropedFiles, setDropedFiles] = useState<File[] | null>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const itemsSettingRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cavasInstance, setCavasInstance] = useState<fabric.Canvas>();

  useEffect(() => {
    const _canvas = containerRef.current;
    const initCanvas = () =>
      new fabric.Canvas('canvas', {
        height: _canvas?.clientHeight ?? 0,
        width: _canvas?.clientWidth ?? 0,
        backgroundColor: '#ffffff00',
      });
    const cinstanace = initCanvas();
    setCavasInstance(cinstanace);
    window.addEventListener('resize', () => {
      if (_canvas) {
        setTimeout(() => {
          const _canvas = containerRef.current;
          cinstanace.setHeight(_canvas?.clientHeight ?? 0);
          cinstanace.setWidth(_canvas?.clientWidth ?? 0);
        }, 1000);
      }
    });
  }, []);

  useEffect(() => {
    if (!cavasInstance) return;
    selectedItems.forEach((item, index) => {
      cavasInstance.add();
    });
  }, [selectedItems]);

  useEffect(() => {
    console.log(fashionItems);
  }, [fashionItems]);

  useEffect(() => {
    if (!dropedFiles) return;
    const fileUrlArray = dropedFiles.map((file) => URL.createObjectURL(file));
    setItems([...fashionItems, ...fileUrlArray]);
    setDropedFiles(null);
  }, [dropedFiles]);

  return (
    <div className={Style.App}>
      <div>
        <h1>Newjeans Rabbit Costume</h1>
      </div>
      <div ref={containerRef} className={Style.RabbitContainer}>
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          <Rabbit color={rabbitColor} />
        </div>
        <canvas id={'canvas'} />
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
                      fabric.Image.fromURL(item, function (myImg) {
                        //i create an extra var for to change some image properties
                        const img1 = myImg.set({
                          left: 0,
                          top: 0,
                        });
                        cavasInstance?.add(img1);
                      });
                      setSelectedItems([...selectedItems, item]);
                      const toggle: 'none' | 'flex' =
                        clothesPicker.current?.style.display === 'none'
                          ? 'flex'
                          : 'none';
                      clothesPicker.current!.style.display = toggle;
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

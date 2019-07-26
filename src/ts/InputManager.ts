export enum InputEventType {
  KEY_PRESSED,
  KEY_DOWN,
  KEY_RELEASED
}

export class InputEvent {
  constructor(
    public readonly type: InputEventType,
    public readonly key: string,
    public readonly meta: boolean,
    public readonly shift: boolean,
    public readonly ctrl: boolean,
    public readonly alt: boolean
  ) {}
}

export type KeyMap = { [key: string]: string };
const standardKeyMap: KeyMap = {
  left: "left",
  right: "right",
  up: "up",
  down: "down",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  space: "jump"
};

export class InputManager {
  private keymap: KeyMap;
  private readonly defaultKeyMap: KeyMap;
  private listeners: ((event: InputEvent) => any)[] = [];

  private keyPressed: { [key: string]: boolean } = {};
  private keyDown: { [key: string]: boolean } = {};
  private keyReleased: { [key: string]: boolean } = {};

  constructor(keymap?: KeyMap) {
    document.addEventListener("keydown", this.keyDownHandler.bind(this));
    document.addEventListener("keyup", this.keyUpHandler.bind(this));

    if (keymap) {
      this.keymap = keymap;
      this.defaultKeyMap = keymap;
    } else {
      this.keymap = standardKeyMap;
      this.defaultKeyMap = standardKeyMap;
    }
  }

  public resetToDefaults() {
    this.keymap = this.defaultKeyMap;
  }

  public update() {
    for (const key in this.keyDown) {
      this.keyPressed[key] = false;
      //send keyDown event
      if (this.keyDown[key]) {
        this.triggerEvent(InputEventType.KEY_DOWN, key);
      }
    }
    for (const key in this.keyReleased) {
      this.keyReleased[key] = false;
    }
  }

  private keyDownHandler(event: KeyboardEvent) {
    // I think?
    event.stopPropagation();

    // Handle
    const key = event.key;
    if (!this.keyDown[key]) {
      this.keyPressed[key] = true;
      this.keyDown[key] = true;
      //send keyPressed event
      this.triggerEvent(InputEventType.KEY_PRESSED, key);
    }
  }

  private keyUpHandler(event: KeyboardEvent) {
    // I think?
    event.stopPropagation();

    // Handle
    const key = event.key;
    this.keyDown[key] = false;
    this.keyReleased[key] = true;
    // send key released event
    this.triggerEvent(InputEventType.KEY_RELEASED, key);
  }

  private triggerEvent(type: InputEventType, key: string) {
    if (key in this.keymap) {
      const ev = new InputEvent(
        type,
        this.keymap[key],
        false,
        false,
        false,
        false
      );
      this.listeners.forEach(listener => listener(ev));
    }
  }

  public subscribe(handler: (event: InputEvent) => any) {
    this.listeners.push(handler);
  }
}

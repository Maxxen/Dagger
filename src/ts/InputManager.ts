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

  private eventQueue: InputEvent[] = [];

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
      //queue keyDown event
      if (this.keyDown[key]) {
        this.queueEvent(InputEventType.KEY_DOWN, key);
      }
    }
    for (const key in this.keyReleased) {
      this.keyReleased[key] = false;
    }

    /*
      Trigger all queued events and empty queue

      TODO:

      Is this problematic? What happens if we receive two events of the same type
      in the same frame. If e.g. the player moves on left key pressed, and we tap 
      the key to press twice in a frame, will the player move two steps instead of one?

      Maybe events should be filtered before they can be added to the queue to make sure
      we dont send the same event twice in a single frame.
    */
    this.eventQueue.forEach(ev => {
      this.listeners.forEach(listener => listener(ev));
    });
    this.eventQueue = [];
  }

  private keyDownHandler(event: KeyboardEvent) {
    // I think?
    event.stopPropagation();

    // Handle
    const key = event.key;
    if (!this.keyDown[key]) {
      this.keyPressed[key] = true;
      this.keyDown[key] = true;
      //queue keyPressed event
      this.queueEvent(InputEventType.KEY_PRESSED, key);
    }
  }

  private keyUpHandler(event: KeyboardEvent) {
    // I think?
    event.stopPropagation();

    // Handle
    const key = event.key;
    this.keyDown[key] = false;
    this.keyReleased[key] = true;
    // queue key released event
    this.queueEvent(InputEventType.KEY_RELEASED, key);
  }

  private queueEvent(type: InputEventType, key: string) {
    if (key in this.keymap) {
      this.eventQueue.push(
        new InputEvent(type, this.keymap[key], false, false, false, false)
      );
    }
  }

  public subscribe(handler: (event: InputEvent) => any) {
    this.listeners.push(handler);
  }
}

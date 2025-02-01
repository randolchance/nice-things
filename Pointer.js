/**
 * @
 * @author KP9InteractivePublic / https://github.com/KP9InteractivePublic
 * @version 0.0.1
 * @copyright 2024 KP9 Interactive
 * 
 */

/**
 * Buttons Enumerator
 */
const BUTTONS = {
	LEFT: 1,
	RIGHT: 2,
	MIDDLE: 4,
	BACK: 8,
	FORWARD: 16,
}

class Pointer {
	constructor( event, absolute=false ) {
		if (!event instanceof MouseEvent || !event instanceof TouchEvent) {
			throw new TypeError( `Expected MouseEvent or TouchEvent, got ${ event }` );
		}

		const { currentTarget, changedTouches, buttons } = event;
		const target = absolute ? document.body : currentTarget;
		const { left, top, width, height } = target.getBoundingClientRect();
		const { clientX, clientY } = changedTouches ? changedTouches[ 0 ] : event;
		this.x = ( clientX - left ) / width * 2 - 1;
		this.y = - ( clientY - top ) / height * 2 + 1;
		this.buttons = buttons;

	}

	static BUTTONS = BUTTONS;

	static validatePointer( pointer ) {
		if (!pointer instanceof Pointer) {
			throw new TypeError( `Expected Pointer, got ${ pointer }` );
		}
	}
	
	static isLeftButtonPressed( pointer ) {
		this.validatePointer( pointer );
		return pointer.buttons === BUTTONS.LEFT;
	}

	static isMiddleButtonPressed( pointer ) {
		this.validatePointer( pointer );
		return pointer.buttons === BUTTONS.MIDDLE;
	}

	static isRightButtonPressed( pointer ) {
		this.validatePointer( pointer );
		return pointer.buttons === BUTTONS.RIGHT;
	}

	static areBothLeftAndRightButtonsPressed( pointer ) {
		this.validatePointer( pointer );
		return pointer.buttons === BUTTONS.LEFT + BUTTONS.RIGHT;
	}

}

export { Pointer }
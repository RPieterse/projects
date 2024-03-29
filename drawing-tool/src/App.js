import React from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, type) {
	const roughElement = {
		id,
		x1,
		y1,
		x2,
		y2,
		type,
	};

	switch (type) {
		case "line":
			roughElement["element"] = generator.line(x1, y1, x2, y2);
			break;
		case "rectangle":
			roughElement["element"] = generator.rectangle(
				x1,
				y1,
				x2 - x1,
				y2 - y1
			);
			break;
		default:
			roughElement["element"] = generator.line(x1, y1, x2, y2);
	}

	return roughElement;
}

const nearCorner = (x, y, x1, y1, name) => {
	return Math.abs(x - x1) <= 5 && Math.abs(y - y1) <= 5 ? name : null;
};

const positionWithinElement = (element, x, y) => {
	const { x1, y1, x2, y2, type } = element;

	let inside, topLeft, topRight, bottomLeft, bottomRight;
	let start, end;

	switch (type) {
		case "line":
			const m = (y2 - y1) / (x2 - x1);
			const c = y1 - m * x1;
			const f = (x) => m * x + c;
			const v = f(x);
			inside = v - 5 <= y && y <= v + 5 ? "inside" : null;
			start = nearCorner(x, y, x1, y1, "start");
			end = nearCorner(x, y, x2, y2, "end");

			return start || end || inside;
		case "rectangle":
			topLeft = nearCorner(x, y, x1, y1, "tl");
			topRight = nearCorner(x, y, x2, y1, "tr");
			bottomLeft = nearCorner(x, y, x1, y2, "bl");
			bottomRight = nearCorner(x, y, x2, y2, "br");
			inside = x1 <= x && x <= x2 && y1 <= y && y <= y2 ? "inside" : null;

			return topLeft || topRight || bottomLeft || bottomRight || inside;
		default:
			return null;
	}
};

function getElementAtPosition(x, y, elements) {
	return elements
		.map((element) => {
			return {
				...element,
				position: positionWithinElement(element, x, y),
			};
		})
		.find((element) => element.position);
}

function adjustElementCoordinates(element) {
	const { x1, y1, x2, y2, type } = element;

	switch (type) {
		case "line":
			if (x1 < x2 || (x1 === x2 && y1 < y2)) {
				return { x1, y1, x2, y2 };
			} else {
				return { x1: x2, y1: y2, x2: x1, y2: y1 };
			}
		case "rectangle":
			return {
				x1: Math.min(x1, x2),
				y1: Math.min(y1, y2),
				x2: Math.max(x1, x2),
				y2: Math.max(y1, y2),
			};
		default:
			return { x1, y1, x2, y2 };
	}
}

function elementForPosition(position) {
	switch (position) {
		case "tl":
		case "br":
		case "start":
		case "end":
			return "nwse-resize";
		case "tr":
		case "bl":
			return "nesw-resize";
		default:
			return "move";
	}
}

function resizedElementCoordinates(clientX, clientY, position, coordinates) {
	switch (position) {
		case "tl":
			return {
				x1: clientX,
				y1: clientY,
				x2: coordinates.x2,
				y2: coordinates.y2,
			};
		case "br":
			return {
				x1: coordinates.x1,
				y1: coordinates.y1,
				x2: clientX,
				y2: clientY,
			};
		case "tr":
			return {
				x1: coordinates.x1,
				y1: clientY,
				x2: clientX,
				y2: coordinates.y2,
			};
		case "bl":
			return {
				x1: clientX,
				y1: coordinates.y1,
				x2: coordinates.x2,
				y2: clientY,
			};
		case "start":
			return {
				x1: clientX,
				y1: clientY,
				x2: coordinates.x2,
				y2: coordinates.y2,
			};
		case "end":
			return {
				x1: coordinates.x1,
				y1: coordinates.y1,
				x2: clientX,
				y2: clientY,
			};
		default:
			return coordinates;
	}
}

function App() {
	const [elements, setElements] = React.useState([]);

	const [action, setAction] = React.useState("none");

	const [tool, setTool] = React.useState("line");

	const [selectedElement, setSelectedElement] = React.useState(null);

	React.useLayoutEffect(() => {
		const canvas = document.getElementById("canvas");
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		const roughCanvas = rough.canvas(canvas);

		elements.forEach(({ element }) => roughCanvas.draw(element));
	}, [elements]);

	const updateElement = (id, x1, y1, x2, y2, type) => {
		const updatedElement = createElement(id, x1, y1, x2, y2, type);

		const elementsCopy = [...elements];
		elementsCopy[id] = updatedElement;
		setElements(elementsCopy);
	};

	const handleMouseDown = (event) => {
		if (tool === "selection") {
			const element = getElementAtPosition(
				event.clientX,
				event.clientY,
				elements
			);
			if (element) {
				const offsetX = event.clientX - element.x1;
				const offsetY = event.clientY - element.y1;
				if (element.position === "inside") {
					setAction("moving");
				} else {
					setAction("resizing");
				}
				setSelectedElement({ ...element, offsetX, offsetY });
			} else {
				setAction("selection");
			}
		} else {
			setAction("drawing");
			const { clientX, clientY } = event;

			const newElement = createElement(
				elements.length,
				clientX,
				clientY,
				clientX,
				clientY,
				tool
			);
			setSelectedElement(newElement);
			setElements((prev) => [...prev, newElement]);
		}
	};

	const handleMouseMove = (event) => {
		const { clientX, clientY } = event;

		if (tool === "selection") {
			const element = getElementAtPosition(clientX, clientY, elements);
			if (element) {
				document.body.style.cursor = elementForPosition(
					element.position
				);
			} else {
				document.body.style.cursor = "default";
			}
		}

		if (action === "moving") {
			const { x1, y1, x2, y2, id, type, offsetX, offsetY } =
				selectedElement;

			const width = x2 - x1;
			const height = y2 - y1;

			const dx = clientX - offsetX;
			const dy = clientY - offsetY;

			updateElement(id, dx, dy, dx + width, dy + height, type);
		} else if (action === "drawing") {
			setAction("drawing");

			const index = elements.length - 1;
			const { x1, y1, type } = elements[index];
			updateElement(index, x1, y1, clientX, clientY, type);
		} else if (action === "resizing") {
			const { id, type, position, ...coordinates } = selectedElement;
			const { x1, y1, x2, y2 } = resizedElementCoordinates(
				clientX,
				clientY,
				position,
				coordinates
			);
			updateElement(id, x1, y1, x2, y2, type);
		}
	};

	const handleMouseUp = () => {
		if (action === "drawing" || action === "resizing") {
			const index = selectedElement.id;
			const { id, type } = elements[index];

			const { x1, y1, x2, y2 } = adjustElementCoordinates(
				elements[index]
			);

			updateElement(id, x1, y1, x2, y2, type);
		}

		setAction("none");
		setSelectedElement(null);
	};

	return (
		<div>
			<div style={{ position: "fixed" }}>
				<input
					type="radio"
					id="selection"
					name="tool"
					value="selection"
					checked={tool === "selection"}
					onChange={() => setTool("selection")}
				/>
				<label htmlFor="selection">Selection</label>
				<input
					type="radio"
					id="line"
					name="tool"
					value="line"
					checked={tool === "line"}
					onChange={() => setTool("line")}
				/>
				<label htmlFor="line">Line</label>
				<input
					type="radio"
					id="rectangle"
					name="tool"
					value="rectangle"
					checked={tool === "rectangle"}
					onChange={() => setTool("rectangle")}
				/>
				<label htmlFor="rectangle">Rectangle</label>
			</div>

			<canvas
				id="canvas"
				width={window.innerWidth}
				height={window.innerHeight}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			/>
		</div>
	);
}

export default App;

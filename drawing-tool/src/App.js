import React from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, tool) {
	const roughElement = {
		id,
		x1,
		y1,
		x2,
		y2,
		tool,
	};

	switch (tool) {
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

const isWithinElement = (element, x, y) => {
	const { x1, y1, x2, y2, tool } = element;

	switch (tool) {
		case "line":
			const m = (y2 - y1) / (x2 - x1);
			const c = y1 - m * x1;
			const f = (x) => m * x + c;
			const v = f(x);
			return v - 5 <= y && y <= v + 5;
		case "rectangle":
			return x1 <= x && x <= x2 && y1 <= y && y <= y2;
		default:
			return false;
	}
};

function getElememtAtPosition(x, y, elements) {
	return elements.find((element) => isWithinElement(element, x, y));
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

	React.useEffect(() => {
		if (tool === "selection") {
			setAction("selection");
		} else {
			setAction("none");
		}
	}, [tool]);

	const updateElement = (id, x1, y1, x2, y2, tool) => {
		const updatedElement = createElement(id, x1, y1, x2, y2, tool);

		const elementsCopy = [...elements];
		elementsCopy[id] = updatedElement;
		setElements(elementsCopy);
	};

	const handleMouseDown = (event) => {
		if (action === "selection" || action === "moving") {
			const element = getElememtAtPosition(
				event.clientX,
				event.clientY,
				elements
			);
			if (element) {
				const offsetX = event.clientX - element.x1;
				const offsetY = event.clientY - element.y1;
				setAction("moving");
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
			setElements((prev) => [...prev, newElement]);
		}
	};

	const handleMouseMove = (event) => {
		const { clientX, clientY } = event;

		if (tool === "selection") {
			const element = getElememtAtPosition(clientX, clientY, elements);
			if (element) {
				document.body.style.cursor = "move";
			} else {
				document.body.style.cursor = "default";
			}
		}

		if (action === "moving") {
			const { x1, y1, x2, y2, id, tool, offsetX, offsetY } =
				selectedElement;

			const width = x2 - x1;
			const height = y2 - y1;

			const dx = clientX - offsetX;
			const dy = clientY - offsetY;

			updateElement(id, dx, dy, dx + width, dy + height, tool);
		} else if (action === "drawing") {
			setAction("drawing");

			const index = elements.length - 1;
			const { x1, y1 } = elements[index];
			updateElement(index, x1, y1, clientX, clientY, tool);
		}
	};

	const handleMouseUp = () => {
		if (tool === "selection") {
			if (action === "moving") {
				setAction("selection");
			}
			return;
		} else {
			setAction("none");
		}
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

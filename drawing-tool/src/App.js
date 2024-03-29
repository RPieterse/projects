import React from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createElement(x1, y1, x2, y2, type) {
	switch (type) {
		case "line":
			return generator.line(x1, y1, x2, y2);
		case "rectangle":
			return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
		case "circle":
			return generator.circle(x1, y1, x2, y2);
		case "ellipse":
			return generator.ellipse(x1, y1, x2, y2);
		default:
			return generator.line(x1, y1, x2, y2);
	}
}

function App() {
	const [elements, setElements] = React.useState([]);

	const [drawing, setDrawing] = React.useState(false);

	const [type, setType] = React.useState("line");

	const canvasRef = React.useRef();

	React.useLayoutEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		const roughCanvas = rough.canvas(canvas);

		elements.forEach((element) => roughCanvas.draw(element));
	}, [elements]);

	console.log(elements);
	const handleMouseDown = (event) => {
		setDrawing(true);

		const { clientX, clientY } = event;

		const newElement = createElement(
			clientX,
			clientY,
			clientX,
			clientY,
			type
		);
		setElements((prev) => [...prev, newElement]);
	};

	const handleMouseMove = (event) => {
		if (!drawing) {
			return;
		}

		const { clientX, clientY } = event;
		const index = elements.length - 1;
		const { x, y } = elements[index];
		const updatedElement = createElement(x, y, clientX, clientY, type);

		const elementsCopy = [...elements];
		elementsCopy[index] = updatedElement;
		setElements(elementsCopy);
	};

	const handleMouseUp = () => {
		setDrawing(false);
	};

	return (
		<canvas
			id="canvas"
			ref={canvasRef}
			width={window.innerWidth}
			height={window.innerHeight}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
		/>
	);
}

export default App;

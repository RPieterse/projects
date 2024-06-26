import React from "react";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";

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
		case "pencil":
			return {
				id,
				type,
				points: [{ x: x1, y: y1 }],
			};
		case "text":
			return {
				id,
				type,
				x1,
				y1,
				x2,
				y2,
				text: "",
			};
		default:
			throw new Error("Invalid element type");
	}

	return roughElement;
}

const nearCorner = (x, y, x1, y1, name) => {
	return Math.abs(x - x1) <= 5 && Math.abs(y - y1) <= 5 ? name : null;
};

const distance = (a, b) =>
	Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const onLine = (x, y, x1, y1, x2, y2, maxOffset = 1) => {
	const a = { x: x1, y: y1 };
	const b = { x: x2, y: y2 };
	const c = { x, y };

	const offset = distance(a, b) - (distance(a, c) + distance(b, c));

	return Math.abs(offset) < maxOffset ? "inside" : null;
};

const positionWithinElement = (element, x, y) => {
	const { x1, y1, x2, y2, type } = element;

	let inside, topLeft, topRight, bottomLeft, bottomRight;
	let start, end;

	switch (type) {
		case "line":
			inside = onLine(x, y, x1, y1, x2, y2);
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
		case "pencil":
			const betweenAnyPoints = element.points.some((point, index) => {
				const nextPoint = element.points[index + 1];
				if (!nextPoint) {
					return false;
				}

				return (
					onLine(
						x,
						y,
						point.x,
						point.y,
						nextPoint.x,
						nextPoint.y,
						5
					) !== null
				);
			});

			return betweenAnyPoints ? "inside" : null;
		case "text":
			return x1 <= x && x <= x2 && y1 <= y && y <= y2 ? "inside" : null;
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

const useHistory = (initialState) => {
	const [index, setIndex] = React.useState(0);
	const [history, setHistory] = React.useState(initialState);

	const setState = (action, overwrite = false) => {
		const newState =
			typeof action === "function" ? action(history[index]) : action;
		if (overwrite) {
			const historyCopy = [...history];
			historyCopy[index] = newState;
			setHistory(historyCopy);
		} else {
			const updatedState = [...history].slice(0, index + 1);
			setHistory([...updatedState, newState]);
			setIndex((prev) => prev + 1);
		}
	};

	const undo = () => {
		if (index > 0) {
			setIndex((prev) => prev - 1);
		}
	};

	const redo = () => {
		if (index < history.length - 1) {
			setIndex((prev) => prev + 1);
		}
	};

	return [history[index], setState, undo, redo];
};

const average = (a, b) => (a + b) / 2;

function getSvgPathFromStroke(points, closed = true) {
	const len = points.length;

	if (len < 4) {
		return ``;
	}

	let a = points[0];
	let b = points[1];
	const c = points[2];

	let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
		2
	)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
		b[1],
		c[1]
	).toFixed(2)} T`;

	for (let i = 2, max = len - 1; i < max; i++) {
		a = points[i];
		b = points[i + 1];
		result += `${average(a[0], b[0]).toFixed(2)},${average(
			a[1],
			b[1]
		).toFixed(2)} `;
	}

	if (closed) {
		result += "Z";
	}

	return result;
}

function adjustmentRequired(type) {
	return type === "line" || type === "rectangle";
}

const drawElement = (roughCanvas, context, element) => {
	if (element.type === "pencil") {
		const outlinePoints = getStroke(element.points);
		const pathData = getSvgPathFromStroke(outlinePoints);
		const myPath = new Path2D(pathData);

		context.fill(myPath);
	} else if (element.type === "text") {
		context.font = "24px serif";
		context.textBaseline = "top";
		context.fillText(element.text, element.x1, element.y1);
	} else {
		return roughCanvas.draw(element.element);
	}
};

const usePressedKeys = () => {
	const [pressedKeys, setPressedKeys] = React.useState(new Set());

	React.useEffect(() => {
		const handleKeyDown = (event) => {
			setPressedKeys((prev) => new Set([...prev]).add(event.key));
		};

		const handleKeyUp = (event) => {
			setPressedKeys((prev) => {
				const newSet = new Set([...prev]);
				newSet.delete(event.key);
				return newSet;
			});
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	return pressedKeys;
};

function App() {
	const [elements, setElements, undo, redo] = useHistory([[]]);

	const [action, setAction] = React.useState("none");

	const [tool, setTool] = React.useState("text");

	const [selectedElement, setSelectedElement] = React.useState(null);

	const textareaRef = React.useRef();

	const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });

	const [zoom, setZoom] = React.useState(1);

	const [zoomOffset, setZoomOffset] = React.useState({ x: 0, y: 0 });

	const [startPanMousePosition, setStartPanMousePosition] = React.useState({
		x: 0,
		y: 0,
	});

	const pressedKeys = usePressedKeys();

	React.useLayoutEffect(() => {
		const canvas = document.getElementById("canvas");
		const context = canvas.getContext("2d");
		const roughCanvas = rough.canvas(canvas);

		context.clearRect(0, 0, canvas.width, canvas.height);

		const scaledWidth = canvas.width * zoom;
		const scaledHeight = canvas.height * zoom;

		const scaledOffsetX = (scaledWidth - canvas.width) / 2;
		const scaledOffsetY = (scaledHeight - canvas.height) / 2;

		setZoomOffset({ x: scaledOffsetX, y: scaledOffsetY });

		context.save();
		context.translate(
			panOffset.x * zoom - scaledOffsetX,
			panOffset.y * zoom - scaledOffsetY
		);
		context.scale(zoom, zoom);

		elements.forEach((element) => {
			if (action === "writing" && selectedElement.id === element.id) {
				return;
			}
			return drawElement(roughCanvas, context, element);
		});
		context.restore();
	}, [elements, action, selectedElement, panOffset, zoom]);

	const updateElement = (id, x1, y1, x2, y2, type, options = {}) => {
		const elementsCopy = [...elements];
		if (type === "pencil") {
			const points = elements[id].points;
			points.push({ x: x2, y: y2 });
			elementsCopy[id] = { ...elements[id], points };
		} else if (type === "text") {
			const textWidth = document
				.getElementById("canvas")
				.getContext("2d")
				.measureText(options.text).width;
			const textHeight = 24;
			elementsCopy[id] = {
				...createElement(
					id,
					x1,
					y1,
					x1 + textWidth,
					y1 + textHeight,
					type
				),
				text: options.text,
			};
		} else {
			elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
		}

		setElements(elementsCopy, true);
	};

	React.useEffect(() => {
		const handleUndoRedoKeyDown = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "z") {
				event.preventDefault();
				if (event.shiftKey) {
					redo();
				} else {
					undo();
				}
			}
		};
		document.addEventListener("keydown", handleUndoRedoKeyDown);
		return () => {
			document.removeEventListener("keydown", handleUndoRedoKeyDown);
		};
	}, [undo, redo]);

	React.useEffect(() => {
		const panOrZoomFunction = (event) => {
			if (pressedKeys.has("Control") || pressedKeys.has("Meta")) {
				onZoom(event.deltaY * -0.01);
			} else {
				setPanOffset((prev) => {
					return {
						x: prev.x - event.deltaX,
						y: prev.y - event.deltaY,
					};
				});
			}
		};
		document.addEventListener("wheel", panOrZoomFunction);
		return () => {
			document.removeEventListener("wheel", panOrZoomFunction);
		};
	}, [pressedKeys]);

	React.useEffect(() => {
		const textArea = textareaRef.current;
		if (action === "writing") {
			setTimeout(() => {
				textArea.focus();
				textArea.value = selectedElement.text;
			}, 1);
		}
	}, [action, selectedElement]);

	const handleBlur = () => {
		const { id, type, x1, y1 } = selectedElement;
		setAction("none");
		setSelectedElement(null);
		updateElement(id, x1, y1, x1, y1, type, {
			text: textareaRef.current.value,
		});
	};

	const getMouseCoordinates = (event) => {
		const { clientX, clientY } = event;

		return {
			clientX: (clientX - panOffset.x * zoom + zoomOffset.x) / zoom,
			clientY: (clientY - panOffset.y * zoom + zoomOffset.y) / zoom,
		};
	};

	const onZoom = (amount) => {
		setZoom((prev) => {
			if (amount === undefined) {
				return 1;
			}
			const newZoom = prev + amount;

			return Math.min(Math.max(newZoom, 0.1), 3);
		});
	};

	const handleMouseDown = (event) => {
		const { clientX, clientY } = getMouseCoordinates(event);
		if (event.button === 1 || pressedKeys.has(" ")) {
			setAction("panning");
			setStartPanMousePosition({ x: clientX, y: clientY });
		}

		if (action === "writing") {
			return;
		}
		if (tool === "selection") {
			const element = getElementAtPosition(clientX, clientY, elements);

			if (element) {
				if (element.type === "pencil") {
					const xOffsets = element.points.map((point) => {
						return event.clientX - point.x;
					});
					const yOffsets = element.points.map((point) => {
						return event.clientY - point.y;
					});

					setSelectedElement({ ...element, xOffsets, yOffsets });
				} else {
					const offsetX = clientX - element.x1;
					const offsetY = clientY - element.y1;

					setSelectedElement({ ...element, offsetX, offsetY });
				}
				if (element.position === "inside") {
					setAction("moving");
				} else {
					setAction("resizing");
				}
				setElements((prev) => prev);
			} else {
				setAction("selection");
			}
		} else {
			if (tool === "text") {
				setAction("writing");
			} else {
				setAction("drawing");
			}

			const newElement = createElement(
				elements.length,
				clientX,
				clientY,
				clientX,
				clientY,
				tool
			);

			setElements((prev) => [...prev, newElement]);
			setSelectedElement(newElement);
		}
	};

	const handleMouseMove = (event) => {
		const { clientX, clientY } = getMouseCoordinates(event);

		if (action === "panning") {
			const deltaX = clientX - startPanMousePosition.x;
			const deltaY = clientY - startPanMousePosition.y;
			setPanOffset((prev) => {
				return {
					x: prev.x - deltaX,
					y: prev.y - deltaY,
				};
			});
			return;
		}

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
			if (selectedElement.type === "pencil") {
				const { xOffsets, yOffsets, points, id } = selectedElement;
				const updatedPoints = points.map((_, index) => {
					return {
						x: clientX - xOffsets[index] + panOffset.x,
						y: clientY - yOffsets[index] + panOffset.y,
					};
				});
				const elementsCopy = [...elements];
				elementsCopy[id] = { ...elements[id], points: updatedPoints };
				setElements(elementsCopy, true);
			} else if (selectedElement.type === "text") {
				const { id, type, offsetX, offsetY, text } = selectedElement;

				const dx = clientX - offsetX + panOffset.x;
				const dy = clientY - offsetY + panOffset.y;

				updateElement(
					id,
					dx,
					dy,
					dx + selectedElement.x2 - selectedElement.x1,
					dy + selectedElement.y2 - selectedElement.y1,
					type,
					{
						text,
					}
				);
			} else {
				const { x1, y1, x2, y2, id, type, offsetX, offsetY } =
					selectedElement;

				const width = x2 - x1;
				const height = y2 - y1;

				const dx = clientX - offsetX;
				const dy = clientY - offsetY;
				updateElement(id, dx, dy, dx + width, dy + height, type);
			}
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

	const handleMouseUp = (event) => {
		const { clientX, clientY } = getMouseCoordinates(event);

		if (selectedElement) {
			if (
				selectedElement.type === "text" &&
				clientX - selectedElement.offsetX + panOffset.x ===
					selectedElement.x1 &&
				clientY - selectedElement.offsetY + panOffset.y ===
					selectedElement.y1
			) {
				setAction("writing");
				return;
			}

			const index = selectedElement.id;
			const { id, type } = elements[index];

			if (
				(action === "drawing" || action === "resizing") &&
				adjustmentRequired(type)
			) {
				const { x1, y1, x2, y2 } = adjustElementCoordinates(
					elements[index]
				);

				updateElement(id, x1, y1, x2, y2, type);
			}
		}

		if (action === "writing") {
			return;
		}

		setAction("none");
		setSelectedElement(null);
	};

	return (
		<div>
			<div style={{ position: "fixed", zIndex: 2 }}>
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
				<input
					type="radio"
					id="pencil"
					name="tool"
					value="pencil"
					checked={tool === "pencil"}
					onChange={() => setTool("pencil")}
				/>
				<label htmlFor="pencil">Pencil</label>
				<input
					type="radio"
					id="text"
					name="tool"
					value="text"
					checked={tool === "text"}
					onChange={() => setTool("text")}
				/>
				<label htmlFor="text">Text</label>
			</div>
			<div
				style={{
					position: "fixed",
					bottom: 0,
					padding: 10,
					zIndex: 2,
				}}>
				<button onClick={undo}>Undo</button>
				<button onClick={redo}>Redo</button>
				<span> </span>
				<button onClick={() => onZoom(-0.1)}>-</button>
				<button onClick={() => onZoom()}>
					{new Intl.NumberFormat("en-GB", {
						style: "percent",
					}).format(zoom)}
				</button>
				<button onClick={() => onZoom(0.1)}>+</button>
			</div>
			{action === "writing" && selectedElement && (
				<textarea
					ref={textareaRef}
					onBlur={handleBlur}
					style={{
						position: "fixed",
						top:
							(selectedElement.y1 - 6) * zoom +
							panOffset.y * zoom -
							zoomOffset.y,
						left:
							selectedElement.x1 * zoom +
							panOffset.x * zoom -
							zoomOffset.x,
						font: `${24 * zoom}px serif`,
						margin: 0,
						zIndex: 2,
						padding: 0,
						border: "none",
						outline: "none",
						resize: "auto",
						overflow: "hidden",
						whitespace: "pre",
						background: "transparent",
					}}></textarea>
			)}
			<canvas
				id="canvas"
				style={{
					position: "absolute",
					zIndex: 1,
				}}
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

const StatusCode = Object.freeze({
  OK: 200,
  PROBABILITY_ERROR: 100500,
} as const);

type Type = typeof StatusCode;
type Status = keyof Type;
type Code = Type[Status];

export default StatusCode;
export { Status, Code };

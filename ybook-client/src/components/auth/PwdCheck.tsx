const PwdCheck = ({
  text,
  condition,
}: {
  text: string;
  condition: boolean;
}) => (
  <li>
    <span className={condition ? "text-green-400" : "text-red-400"}>
      {text}
    </span>
  </li>
);

export default PwdCheck;

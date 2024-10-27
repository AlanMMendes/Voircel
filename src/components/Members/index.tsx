function Members(members: any) {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-red-500 p-4 text-white">
        <h1>Membros</h1>
        {members?.members?.map((member: any, index: any) => (
          <div
            key={index}
            className="flex flex-row gap-2 justify-start items-center"
          >
            <span>{member}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Members;

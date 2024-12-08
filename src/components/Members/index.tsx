import * as Avatar from "@radix-ui/react-avatar";

function Members(members: any) {
  return (
    <div className="flex flex-col gap-2 justify-start items-center p-4 bg-zinc-900"> 
      <div className="flex flex-col gap-2 justify-start items-center">
        <h1>Online</h1>
        <div style={{ display: "flex", gap: 20 }}>
	
	</div>
        {members?.members?.map((member: any, index: any) => (
          <div
            key={index}
            className="flex flex-row gap-2 justify-start items-center"
          >
            		
		<Avatar.Root className="border-2 border-zinc-800 rounded-full flex justify-center items-center w-10 h-10">
			<Avatar.Fallback className="AvatarFallback">{member.slice(0, 2).toUpperCase()}</Avatar.Fallback>
		</Avatar.Root>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Members;

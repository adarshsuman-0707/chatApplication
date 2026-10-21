select * from LoginPage
create table Attendance 
(EmplName nvarchar(100) not null,
Emp_CheckIn DateTime not null,
Emp_checkOut DateTime,
status varchar(23));
alter table Attendance Add EmpId int Primary key;
select * from Attendance

	alter procedure AttendCheckin
	@EmplName nvarChar(100),
	@CheckIn DateTime,
	@status varchar(23) ='present',
	@EmpId int =0
	 as 
	 Begin
	 Declare @counts int;
	  Set Nocount on;
	  Select @counts=Count(*) from Attendance where EmpId=@EmpId;

	  if(@counts=0)
	  Begin 

	  insert into Attendance values(@EmplName,@CheckIn,'',@status,@EmpId);
	 End;

	 End;

  EXEC AttendCheckin
    @EmplName = 'Sunny Suman',
    @CheckIn = '2025-10-15 09:00:00',
    @EmpId = 102;
create Procedure AttendanceCheckout
	@Checkout DateTime,
	@EmpId int 
	as 
	Begin
 Declare @counts int;
	  Set Nocount on;
	  Select @counts=Count(*) from Attendance where EmpId=@EmpId;

	  if(@counts=1)
	  Begin 

	update Attendance set Emp_checkOut=@Checkout where EmpId=@EmpId;
	End;
	End;

	  EXEC AttendanceCheckout
   
    @Checkout = '2025-1-15 07:30:00',
    @EmpId = 101;
	


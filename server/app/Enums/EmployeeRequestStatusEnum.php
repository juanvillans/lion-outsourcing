<?php

namespace App\Enums;

enum EmployeeRequestStatusEnum: string
{
    case Pending = 'pending';
    case Accepted = 'accepted';
    case Rejected = 'rejected';
}

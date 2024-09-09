import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Table } from 'primeng/table';
import { Code } from '../../domain/code';
import { Customer, Representative } from '../../domain/customer';
import { CustomerService } from '../../service/customerservice';

@Component({
    selector: 'filter-advanced-doc',
    template: ` <app-docsectiontext>
            <p>Filters are displayed in an overlay.</p>
        </app-docsectiontext>
        <p-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <p-table
                    #dt1
                    [value]="customers"
                    dataKey="id"
                    [rows]="10"
                    [rowsPerPageOptions]="[10, 25, 50]"
                    [loading]="loading"
                    [paginator]="true"
                    [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                >
                    <ng-template pTemplate="caption">
                        <div class="flex">
                            <p-button label="Clear" [outlined]="true" icon="pi pi-filter-slash" (click)="clear(dt1)" />
                            <p-icon-field iconPosition="left" class="ml-auto">
                                <p-input-icon>
                                    <i class="pi pi-search"></i>
                                </p-input-icon>
                                <input
                                    pInputText
                                    type="text"
                                    (input)="dt2.filterGlobal($event.target.value, 'contains')"
                                    placeholder="Search keyword"
                                />
                            </p-icon-field>
                        </div>
                    </ng-template>
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="min-width:15rem">
                                <div class="flex items-center">
                                    Name
                                    <p-columnFilter type="text" field="name" display="menu" />
                                </div>
                            </th>
                            <th style="min-width:15rem">
                                <div class="flex items-center">
                                    Country
                                    <p-columnFilter type="text" field="country.name" display="menu" />
                                </div>
                            </th>
                            <th style="min-width:15rem">
                                <div class="flex items-center">
                                    Agent
                                    <p-columnFilter
                                        field="representative"
                                        matchMode="in"
                                        display="menu"
                                        [showMatchModes]="false"
                                        [showOperator]="false"
                                        [showAddButton]="false"
                                    >
                                        <ng-template pTemplate="header">
                                            <div class="px-4 pt-4 pb-0">
                                                <span class="font-bold">Agent Picker</span>
                                            </div>
                                        </ng-template>
                                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                            <p-multiselect
                                                [(ngModel)]="value"
                                                [options]="representatives"
                                                placeholder="Any"
                                                (onChange)="filter($event.value)"
                                                optionLabel="name"
                                            >
                                                <ng-template let-option pTemplate="item">
                                                    <div class="inline-block align-middle">
                                                        <img
                                                            [alt]="option.label"
                                                            src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ option.image }}"
                                                            width="24"
                                                            class="align-middle"
                                                        />
                                                        <span class="ml-1 mt-1">{{ option.name }}</span>
                                                    </div>
                                                </ng-template>
                                            </p-multiselect>
                                        </ng-template>
                                    </p-columnFilter>
                                </div>
                            </th>
                            <th style="min-width:10rem">
                                <div class="flex items-center">
                                    Date
                                    <p-columnFilter type="date" field="date" display="menu" />
                                </div>
                            </th>
                            <th style="min-width:10rem">
                                <div class="flex items-center">
                                    Balance
                                    <p-columnFilter type="numeric" field="balance" display="menu" currency="USD" />
                                </div>
                            </th>
                            <th style="min-width:10rem">
                                <div class="flex items-center">
                                    Status
                                    <p-columnFilter field="status" matchMode="equals" display="menu">
                                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                            <p-select
                                                [(ngModel)]="value"
                                                [options]="statuses"
                                                (onChange)="filter($event.value)"
                                                placeholder="Any"
                                            >
                                                <ng-template let-option pTemplate="item">
                                                    <p-tag [value]="option.value" [severity]="getSeverity(option.label)"></p-tag>
                                                </ng-template>
                                            </p-select>
                                        </ng-template>
                                    </p-columnFilter>
                                </div>
                            </th>
                            <th style="min-width:10rem">
                                <div class="flex items-center">
                                    Activity
                                    <p-columnFilter
                                        field="activity"
                                        matchMode="between"
                                        display="menu"
                                        [showMatchModes]="false"
                                        [showOperator]="false"
                                        [showAddButton]="false"
                                    >
                                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                            <p-slider
                                                [(ngModel)]="value"
                                                [range]="true"
                                                styleClass="m-4"
                                                (onSlideEnd)="filter($event.values)"
                                            />
                                            <div class="flex items-center px-2">
                                                <span *ngIf="!value">0</span>
                                                <span *ngIf="value">{{ value[0] }} - {{ value[1] }}</span>
                                            </div>
                                        </ng-template>
                                    </p-columnFilter>
                                </div>
                            </th>
                            <th style="width: 3rem">
                                <div class="flex items-center">
                                    Verified
                                    <p-columnFilter type="boolean" field="verified" display="menu" />
                                </div>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-customer>
                        <tr>
                            <td>
                                {{ customer.name }}
                            </td>
                            <td>
                                <img
                                    src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                                    [class]="'flag flag-' + customer.country.code"
                                    style="width: 20px"
                                />
                                <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                            </td>
                            <td>
                                <img
                                    [alt]="customer.representative.name"
                                    src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}"
                                    width="32"
                                    style="vertical-align: middle"
                                />
                                <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                            </td>
                            <td>
                                {{ customer.date | date : 'MM/dd/yyyy' }}
                            </td>
                            <td>
                                {{ customer.balance | currency : 'USD' : 'symbol' }}
                            </td>
                            <td>
                                <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                            </td>
                            <td>
                                <p-progress-bar [value]="customer.activity" [showValue]="false" />
                            </td>
                            <td class="text-center">
                                <i
                                    class="pi"
                                    [ngClass]="{
                                        'text-green-500 pi-check-circle': customer.verified,
                                        'text-red-500 pi-times-circle': !customer.verified,
                                    }"
                                ></i>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="7">No customers found.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-deferred-demo>
        <app-code [code]="code" selector="table-filter-advanced-demo" [extFiles]="extFiles"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterAdvancedDoc {
    customers!: Customer[];

    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    searchValue: string | undefined;

    activityValues: number[] = [0, 100];

    constructor(private customerService: CustomerService, private cd: ChangeDetectorRef) {}

    loadDemoData() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.loading = false;

            this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
            this.cd.markForCheck();
        });

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' },
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' },
        ];
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }

    code: Code = {
        basic: `  <p-table
    #dt1
    [value]="customers"
    dataKey="id"
    [rows]="10"
    [rowsPerPageOptions]="[10, 25, 50]"
    [loading]="loading"
    [paginator]="true"
    [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
>
    <ng-template pTemplate="caption">
        <div class="flex">
            <p-button label="Clear" [outlined]="true" icon="pi pi-filter-slash" (click)="clear(dt1)" />
            <p-icon-field iconPosition="left" class="ml-auto">
                <p-input-icon>
                    <i class="pi pi-search"></i>
                </p-input-icon>
                <input
                    pInputText
                    type="text"
                    (input)="dt2.filterGlobal($event.target.value, 'contains')"
                    placeholder="Search keyword"
                />
            </p-icon-field>
        </div>
    </ng-template>
    <ng-template pTemplate="header">
        <tr>
            <th style="min-width:15rem">
                <div class="flex items-center">
                    Name
                    <p-columnFilter type="text" field="name" display="menu" />
                </div>
            </th>
            <th style="min-width:15rem">
                <div class="flex items-center">
                    Country
                    <p-columnFilter type="text" field="country.name" display="menu" />
                </div>
            </th>
            <th style="min-width:15rem">
                <div class="flex items-center">
                    Agent
                    <p-columnFilter
                        field="representative"
                        matchMode="in"
                        display="menu"
                        [showMatchModes]="false"
                        [showOperator]="false"
                        [showAddButton]="false"
                    >
                        <ng-template pTemplate="header">
                            <div class="px-4 pt-4 pb-0">
                                <span class="font-bold">Agent Picker</span>
                            </div>
                        </ng-template>
                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                            <p-multiselect
                                [(ngModel)]="value"
                                [options]="representatives"
                                placeholder="Any"
                                (onChange)="filter($event.value)"
                                optionLabel="name"
                            >
                                <ng-template let-option pTemplate="item">
                                    <div class="inline-block align-middle">
                                        <img
                                            [alt]="option.label"
                                            src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ option.image }}"
                                            width="24"
                                            class="align-middle"
                                        />
                                        <span class="ml-1 mt-1">{{ option.name }}</span>
                                    </div>
                                </ng-template>
                            </p-multiselect>
                        </ng-template>
                    </p-columnFilter>
                </div>
            </th>
            <th style="min-width:10rem">
                <div class="flex items-center">
                    Date
                    <p-columnFilter type="date" field="date" display="menu" />
                </div>
            </th>
            <th style="min-width:10rem">
                <div class="flex items-center">
                    Balance
                    <p-columnFilter type="numeric" field="balance" display="menu" currency="USD" />
                </div>
            </th>
            <th style="min-width:10rem">
                <div class="flex items-center">
                    Status
                    <p-columnFilter field="status" matchMode="equals" display="menu">
                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                            <p-select
                                [(ngModel)]="value"
                                [options]="statuses"
                                (onChange)="filter($event.value)"
                                placeholder="Any"
                            >
                                <ng-template let-option pTemplate="item">
                                    <p-tag [value]="option.value" [severity]="getSeverity(option.label)"></p-tag>
                                </ng-template>
                            </p-select>
                        </ng-template>
                    </p-columnFilter>
                </div>
            </th>
            <th style="min-width:10rem">
                <div class="flex items-center">
                    Activity
                    <p-columnFilter
                        field="activity"
                        matchMode="between"
                        display="menu"
                        [showMatchModes]="false"
                        [showOperator]="false"
                        [showAddButton]="false"
                    >
                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                            <p-slider
                                [(ngModel)]="value"
                                [range]="true"
                                styleClass="m-4"
                                (onSlideEnd)="filter($event.values)"
                            />
                            <div class="flex items-center px-2">
                                <span *ngIf="!value">0</span>
                                <span *ngIf="value">{{ value[0] }} - {{ value[1] }}</span>
                            </div>
                        </ng-template>
                    </p-columnFilter>
                </div>
            </th>
            <th style="width: 3rem">
                <div class="flex items-center">
                    Verified
                    <p-columnFilter type="boolean" field="verified" display="menu" />
                </div>
            </th>
        </tr>
    </ng-template>
    <ng-template pTemplate="body" let-customer>
        <tr>
            <td>
                {{ customer.name }}
            </td>
            <td>
                <img
                    src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                    [class]="'flag flag-' + customer.country.code"
                    style="width: 20px"
                />
                <span class="ml-1 align-middle">{{ customer.country.name }}</span>
            </td>
            <td>
                <img
                    [alt]="customer.representative.name"
                    src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}"
                    width="32"
                    style="vertical-align: middle"
                />
                <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
            </td>
            <td>
                {{ customer.date | date : 'MM/dd/yyyy' }}
            </td>
            <td>
                {{ customer.balance | currency : 'USD' : 'symbol' }}
            </td>
            <td>
                <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
            </td>
            <td>
                <p-progress-bar [value]="customer.activity" [showValue]="false" />
            </td>
            <td class="text-center">
                <i
                    class="pi"
                    [ngClass]="{
                        'text-green-500 pi-check-circle': customer.verified,
                        'text-red-500 pi-times-circle': !customer.verified,
                    }"
                ></i>
            </td>
        </tr>
    </ng-template>
    <ng-template pTemplate="emptymessage">
        <tr>
            <td colspan="7">No customers found.</td>
        </tr>
    </ng-template>
</p-table>`,
        html: `<div class="card">
    <p-table
        #dt1
        [value]="customers"
        dataKey="id"
        [rows]="10"
        [rowsPerPageOptions]="[10, 25, 50]"
        [loading]="loading"
        [paginator]="true"
        [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
    >
        <ng-template pTemplate="caption">
            <div class="flex">
                <p-button label="Clear" [outlined]="true" icon="pi pi-filter-slash" (click)="clear(dt1)" />
                <p-icon-field iconPosition="left" class="ml-auto">
                    <p-input-icon>
                        <i class="pi pi-search"></i>
                    </p-input-icon>
                    <input
                        pInputText
                        type="text"
                        (input)="dt2.filterGlobal($event.target.value, 'contains')"
                        placeholder="Search keyword"
                    />
                </p-icon-field>
            </div>
        </ng-template>
        <ng-template pTemplate="header">
            <tr>
                <th style="min-width:15rem">
                    <div class="flex items-center">
                        Name
                        <p-columnFilter type="text" field="name" display="menu" />
                    </div>
                </th>
                <th style="min-width:15rem">
                    <div class="flex items-center">
                        Country
                        <p-columnFilter type="text" field="country.name" display="menu" />
                    </div>
                </th>
                <th style="min-width:15rem">
                    <div class="flex items-center">
                        Agent
                        <p-columnFilter
                            field="representative"
                            matchMode="in"
                            display="menu"
                            [showMatchModes]="false"
                            [showOperator]="false"
                            [showAddButton]="false"
                        >
                            <ng-template pTemplate="header">
                                <div class="px-4 pt-4 pb-0">
                                    <span class="font-bold">Agent Picker</span>
                                </div>
                            </ng-template>
                            <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                <p-multiselect
                                    [(ngModel)]="value"
                                    [options]="representatives"
                                    placeholder="Any"
                                    (onChange)="filter($event.value)"
                                    optionLabel="name"
                                >
                                    <ng-template let-option pTemplate="item">
                                        <div class="inline-block align-middle">
                                            <img
                                                [alt]="option.label"
                                                src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ option.image }}"
                                                width="24"
                                                class="align-middle"
                                            />
                                            <span class="ml-1 mt-1">{{ option.name }}</span>
                                        </div>
                                    </ng-template>
                                </p-multiselect>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th style="min-width:10rem">
                    <div class="flex items-center">
                        Date
                        <p-columnFilter type="date" field="date" display="menu" />
                    </div>
                </th>
                <th style="min-width:10rem">
                    <div class="flex items-center">
                        Balance
                        <p-columnFilter type="numeric" field="balance" display="menu" currency="USD" />
                    </div>
                </th>
                <th style="min-width:10rem">
                    <div class="flex items-center">
                        Status
                        <p-columnFilter field="status" matchMode="equals" display="menu">
                            <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                <p-select
                                    [(ngModel)]="value"
                                    [options]="statuses"
                                    (onChange)="filter($event.value)"
                                    placeholder="Any"
                                >
                                    <ng-template let-option pTemplate="item">
                                        <p-tag [value]="option.value" [severity]="getSeverity(option.label)"></p-tag>
                                    </ng-template>
                                </p-select>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th style="min-width:10rem">
                    <div class="flex items-center">
                        Activity
                        <p-columnFilter
                            field="activity"
                            matchMode="between"
                            display="menu"
                            [showMatchModes]="false"
                            [showOperator]="false"
                            [showAddButton]="false"
                        >
                            <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                <p-slider
                                    [(ngModel)]="value"
                                    [range]="true"
                                    styleClass="m-4"
                                    (onSlideEnd)="filter($event.values)"
                                />
                                <div class="flex items-center px-2">
                                    <span *ngIf="!value">0</span>
                                    <span *ngIf="value">{{ value[0] }} - {{ value[1] }}</span>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th style="width: 3rem">
                    <div class="flex items-center">
                        Verified
                        <p-columnFilter type="boolean" field="verified" display="menu" />
                    </div>
                </th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-customer>
            <tr>
                <td>
                    {{ customer.name }}
                </td>
                <td>
                    <img
                        src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                        [class]="'flag flag-' + customer.country.code"
                        style="width: 20px"
                    />
                    <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                </td>
                <td>
                    <img
                        [alt]="customer.representative.name"
                        src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}"
                        width="32"
                        style="vertical-align: middle"
                    />
                    <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                </td>
                <td>
                    {{ customer.date | date : 'MM/dd/yyyy' }}
                </td>
                <td>
                    {{ customer.balance | currency : 'USD' : 'symbol' }}
                </td>
                <td>
                    <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                </td>
                <td>
                    <p-progress-bar [value]="customer.activity" [showValue]="false" />
                </td>
                <td class="text-center">
                    <i
                        class="pi"
                        [ngClass]="{
                            'text-green-500 pi-check-circle': customer.verified,
                            'text-red-500 pi-times-circle': !customer.verified,
                        }"
                    ></i>
                </td>
            </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
            <tr>
                <td colspan="7">No customers found.</td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
        typescript: `import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Customer, Representative } from '../domain/customer';
import { CustomerService } from '../service/customerservice';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'table-filter-advanced-demo',
    templateUrl: 'table-filter-advanced-demo.html',
    standalone: true,
    imports: [TableModule, HttpClientModule, CommonModule, InputTextModule, TagModule, 
    SelectModule, MultiSelectModule, ProgressBarModule, ButtonModule, IconFieldModule, InputIconModule],
    providers: [CustomerService]
})
export class TableFilterAdvancedDemo implements OnInit {
    customers!: Customer[];

    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.loading = false;

            this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
        });

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = ''
    }

    getSeverity(status: string) {
        switch (status.toLowerCase()) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}`,
        scss: `
:host ::ng-deep {
    .p-progressbar {
        height: .5rem;
        background-color: #D8DADC;
    
        .p-progressbar-value {
            background-color: #607D8B;
        }
    }
}`,
        data: `{
    id: 1000,
    name: 'James Butt',
    country: {
        name: 'Algeria',
        code: 'dz'
    },
    company: 'Benton, John B Jr',
    date: '2015-09-13',
    status: 'unqualified',
    verified: true,
    activity: 17,
    representative: {
        name: 'Ioni Bowcher',
        image: 'ionibowcher.png'
    },
    balance: 70663
},
...`,
        service: ['CustomerService'],
    };

    extFiles = [
        {
            path: 'src/domain/customer.ts',
            content: `
export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string | Date;
    status?: string;
    activity?: number;
    representative?: Representative;
    verified?: boolean;
    balance?: number;
}`,
        },
    ];
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repository.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCommonTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PaymentProvider",
                table: "TicketPurchases",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StripePaymentIntentId",
                table: "TicketPurchases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripeSessionId",
                table: "TicketPurchases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalPaidUsd",
                table: "TicketPurchases",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPriceUsd",
                table: "TicketPurchases",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "AdminNote",
                table: "RefundRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ProcessedAtUtc",
                table: "RefundRequests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RefundedAmountUsd",
                table: "RefundRequests",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "RequestedQuantity",
                table: "RefundRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentProvider",
                table: "TicketPurchases");

            migrationBuilder.DropColumn(
                name: "StripePaymentIntentId",
                table: "TicketPurchases");

            migrationBuilder.DropColumn(
                name: "StripeSessionId",
                table: "TicketPurchases");

            migrationBuilder.DropColumn(
                name: "TotalPaidUsd",
                table: "TicketPurchases");

            migrationBuilder.DropColumn(
                name: "UnitPriceUsd",
                table: "TicketPurchases");

            migrationBuilder.DropColumn(
                name: "AdminNote",
                table: "RefundRequests");

            migrationBuilder.DropColumn(
                name: "ProcessedAtUtc",
                table: "RefundRequests");

            migrationBuilder.DropColumn(
                name: "RefundedAmountUsd",
                table: "RefundRequests");

            migrationBuilder.DropColumn(
                name: "RequestedQuantity",
                table: "RefundRequests");
        }
    }
}
